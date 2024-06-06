import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, Picker, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';


export default function App() {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [adLocations, setAdLocations] = useState([]);
  const [adSpends, setAdSpends] = useState([]);
  const [businessCryptos, setBusinessCryptos] = useState([]);
  const [totalAdSpend, setTotalAdSpend] = useState(0);
  const [totalCryptoEarned, setTotalCryptoEarned] = useState(0);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Fetch ad locations on component mount
    fetchAdLocations();
  }, []);

  const fetchAdLocations = async () => {
    try {
      const response = await axios.get('http://localhost:8000/ad-locations/');
      setAdLocations(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAdDetails = async (locationName) => {
    try {
      const response = await axios.get(`http://localhost:8000/ad-spends/?location=${encodeURIComponent(locationName)}`);
      setAdSpends(response.data);

      // Calculate total amount spent on ads
      const totalSpend = response.data.reduce((total, spend) => total + parseFloat(spend.amount), 0);
      setTotalAdSpend(totalSpend);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCryptoDetails = async (locationName) => {
    try {
      const response = await axios.get(`http://localhost:8000/business-cryptos/?location=${encodeURIComponent(locationName)}`);
      setBusinessCryptos(response.data);

      // Calculate total crypto earned
      const totalCrypto = response.data.reduce((total, crypto) => total + parseFloat(crypto.crypto_amount), 0);
      setTotalCryptoEarned(totalCrypto);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLocationChange = (locationName) => {
    setSelectedLocation(locationName);
    if (locationName === 'all') {
      fetchAllDetails();
    } else {
      fetchAdDetails(locationName);
      fetchCryptoDetails(locationName);
    }
  };

  const fetchAllDetails = async () => {
    try {
      const adResponse = await axios.get(`http://localhost:8000/ad-spends/`);
      setAdSpends(adResponse.data);

      const cryptoResponse = await axios.get(`http://localhost:8000/business-cryptos/`);
      setBusinessCryptos(cryptoResponse.data);

      // Calculate total amount spent on ads
      const totalAd = adResponse.data.reduce((total, spend) => total + parseFloat(spend.amount), 0);
      setTotalAdSpend(totalAd);

      // Calculate total crypto earned
      const totalCrypto = cryptoResponse.data.reduce((total, crypto) => total + parseFloat(crypto.crypto_amount), 0);
      setTotalCryptoEarned(totalCrypto);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={[styles.container, theme === 'dark' && styles.darkContainer]}>
      <View style={styles.logoContainer}>
        <Image source={require('./assets/logo.png')} style={styles.logo} />
      </View>
      <Text style={[styles.title, theme === 'dark' && styles.darkTitle]}>Select Location:</Text>
      <Picker
        selectedValue={selectedLocation}
        style={[styles.picker, theme === 'dark' && styles.darkPicker]}
        onValueChange={(itemValue) => handleLocationChange(itemValue)}>
        <Picker.Item label="Select Location" value="" /> {/* Default option */}
        <Picker.Item label="All" value="all" /> {/* Option for fetching everything */}
        {adLocations.map(location => (
          <Picker.Item key={location.id} label={location.name} value={location.name} />
        ))}
      </Picker>
      {selectedLocation !== '' && (
        <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          <ScrollView style={[styles.adSpendContainer, styles.lightBackground]}>
              <Text style={[styles.sectionTitle, theme === 'dark' && styles.darkSectionTitle]}>Spending on Ads</Text>
              <Text style={[styles.totalText, theme === 'dark' && styles.darkTotalText]}>
                Total Money spent on Ads: ${totalAdSpend}
              </Text>
              <Text style={[styles.totalText, theme === 'dark' && styles.darkTotalText]}>
                Breakup of Ads:
              </Text>
              {adSpends.map(spend => (
                <TouchableOpacity key={spend.id} style={[styles.card, theme === 'dark' && styles.darkCard]}>
                  <Text style={[styles.cardText, theme === 'dark' && styles.darkCardText]}>Amount Spent: ${spend.amount}</Text>
                  <Text style={[styles.cardText,                  theme === 'dark' && styles.darkCardText]}>Date: {spend.date}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          <ScrollView style={[styles.businessCryptoContainer, styles.lightBackground]}>
              <Text style={[styles.sectionTitle, theme === 'dark' && styles.darkSectionTitle]}>Earning of Business Crypto</Text>
              <Text style={[styles.totalText, theme === 'dark' && styles.darkTotalText]}>
                Total Business Crypto earned: ${totalCryptoEarned}
              </Text>
              <Text style={[styles.totalText, theme === 'dark' && styles.darkTotalText]}>
                Breakup of crypto:
              </Text>
              {businessCryptos.map(crypto => (
                <TouchableOpacity key={crypto.id} style={[styles.card, theme === 'dark' && styles.darkCard]}>
                  <Text style={[styles.cardText, theme === 'dark' && styles.darkCardText]}>Crypto Amount: ${crypto.crypto_amount}</Text>
                  <Text style={[styles.cardText, theme === 'dark' && styles.darkCardText]}>Date: {crypto.date}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
        </View>
      </ScrollView>

      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Light gray background
    alignItems: 'center',
  },
  darkContainer: {
    backgroundColor: '#222',
  },
  logoContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  logo: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  darkTitle: {
    color: '#fff',
  },
  picker: {
    width: '80%',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  darkPicker: {
    backgroundColor: '#444',
    color: '#fff',
  },
  scrollView: {
    width: '100%',
  },
  contentContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    alignSelf: 'center',
  },
  darkSectionTitle: {
    color: '#fff',
  },
  adSpendContainer: {
    marginRight: 10,
    width: '45%',
    backgroundColor: '#f5faff', // Light shade of blue
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  businessCryptoContainer: {
    marginLeft: 10,
    width: '45%',
    backgroundColor: '#f5faff', // Light shade of blue
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  card: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  darkCard: {
    backgroundColor: '#333',
  },
  cardText: {
    fontSize: 16,
  },
  darkCardText: {
    color: '#fff',
  },
  lightBackground: {
    backgroundColor: '#f5faff',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333', // Default text color
  },
  darkTotalText: {
    color: '#fff', // Dark theme text color
  },
  scrollContent: {
    flexGrow: 1,
  },
});


 