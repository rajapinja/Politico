import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../app/Config';
import GradientBanner from '../components/GradientBanner';
import backgroundImage from '../images/iceland-1979445_1280.jpg';
import { LinearGradient } from 'expo-linear-gradient';

const DynamicScoresDisplay = () => {

  const [roundNumbers, setRoundNumbers] = useState([]);
  const [playerScores, setPlayerScores] = useState([]);
  const [noRecordsMsg, setNoRecordsMsg] = useState(0);
  const [jwtToken, setJwtToken] = useState('');

  // Always retrieve accessToken from AsyncStorage
  useEffect(() => {
    retrieveValues();
    getRoundNumber();
    getDynamicScores();
  }, [playerScores]);
  //[jwtToken, playerScores, roundNumbers]
  // Function to retrieve values from AsyncStorage
  const retrieveValues = async () => {
    try {
      // Use Promise.all to retrieve multiple items asynchronously
      const keyValues = [
        { key: 'accessToken' },
        { key: 'loginTime' },
      ];

      const retrievedValues = await Promise.all(
        keyValues.map(async ({ key }) => {
          try {
            const value = await AsyncStorage.getItem(key);
            console.log(`Retrieved ${key}:`, value);
            return { key, value };
          } catch (error) {
            console.error(`Error retrieving ${key}:`, error);
            return { key, value: null }; // Handle retrieval errors
          }
        })
      );
      // Process retrieved values as needed
      const accessToken = retrievedValues.find((item) => item.key === 'accessToken')?.value;
      //const loginTime = retrievedValues.find((item) => item.key === 'loginTime')?.value;
      setJwtToken(accessToken.trim());
      // Now you can use accessToken and loginTime in your code
      //console.log('accessToken:', accessToken);
      //console.log('loginTime:', loginTime);
    } catch (error) {
      console.error('Error retrieving values:', error);
    }
  };

  // Define the headers with the access token
  const headers = {
    'Authorization': `Bearer ${jwtToken}`,
    'Content-Type': 'application/json',
  };

  // Always retrieve accessToken from AsyncStorage
  useEffect(() => {
    getRoundNumber();
    getDynamicScores();
  }, [headers.Authorization]);

  //useEffect(() => {
  const getRoundNumber = async () => {
    console.log("headers.Authorization :", headers.Authorization);
    // Fetch the maximum round number
    axios.get(`${BASE_URL}/api/round-number`, { headers: headers })
      .then(response => {
        //console.log('Response data:', response.data);
        //console.log('Headers:', response.headers); 
        const maxRoundNumber = response.data.roundNumber;
        const rounds = Array.from({ length: maxRoundNumber }, (_, index) => index + 1);
        setRoundNumbers(rounds);
        //setRoundNumber(rounds);
      })
      .catch(error => {
        console.error("Error fetching max round number:", error);
        // Log or display the full error response
        //console.log("Full error response:", error.response);
        return null;
      });
  };

  //useEffect(() => {
  const getDynamicScores = async () => {
    console.log("headers.Authorization :", headers.Authorization);
    // Fetch player scores with varying round numbers   
    axios.get(`${BASE_URL}/api/display_scores_dynamic`, { headers: headers })
      .then(response => {
        console.log('Response message :', response.data.message);
        setNoRecordsMsg(response.data.message)
        //console.log('Response Headers:', response.headers);
        setPlayerScores(response.data.playerScores);
      })
      .catch(error => {
        console.error('Error fetching player scores:', error);
      });
  };

  const navigation = useNavigation();

  // Render Card Layout for each Player
  const renderPlayerCards = () => {
    const playersPerRow = 3;
    // Splitting the players into groups of 3 for each row
    const playerRows = [];
    for (let i = 0; i < playerScores.length; i += playersPerRow) {
      const rowPlayers = playerScores.slice(i, i + playersPerRow);
      playerRows.push(rowPlayers);
    }
    return playerRows.map((rowPlayers, index) => (
      <View key={index} style={styles.playerCardRow}>
        {rowPlayers.map(player => (
          <LinearGradient
            key={player.name}
            //colors={['#FAD961', '#F76B1C']} // Gradient colors
            //colors={['rgba(255, 126, 95, 0.7)', 'rgba(254, 180, 123, 0.7)', 'rgba(79, 172, 254, 0.7)']}
            //Soft Pastels:
            //colors={['rgba(248, 195, 215, 0.5)', 'rgba(213, 220, 227, 0.5)', 'rgba(233, 221, 209, 0.5)']}
            //Nature Tones:
            //colors={['rgba(134, 194, 163, 0.5)', 'rgba(247, 220, 111, 0.5)', 'rgba(232, 89, 69, 0.5)']}
            //Oceanic Shades:    
            //colors={['rgba(100, 179, 237, 0.5)', 'rgba(56, 102, 150, 0.5)', 'rgba(179, 221, 231, 0.5)']}
            colors={['rgba(0, 128, 128, 0.5)', 'rgba(0, 0, 139, 0.5)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.playerCard}
          >
            <Text style={styles.playerName}>{player.name}</Text>
            {roundNumbers.map(roundNumber => (
              <Text style={styles.roundScore} key={roundNumber}>
                Round {roundNumber}: {player[`round_${roundNumber}`]}
              </Text>
            ))}
            <Text style={styles.totalScore}>Total Score: {player.total_Score}</Text>
          </LinearGradient>
        ))}
      </View>
    ));
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <GradientBanner text='Score Recorder' />
        {/* Render player cards */}
        {playerScores.length !== undefined && renderPlayerCards()}
        {/* If no records */}
        {playerScores.length === undefined &&
          <View style={styles.norecordsView}>
            <Text style={styles.norecordsText}>{noRecordsMsg}</Text>
          </View>
        }
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.buttonLogout}
            onPress={() => navigation.navigate('Logout')}
            disabled={false}
            activeOpacity={0.7}
            underlayColor="#EFEFEF"
          >
            <Text style={styles.buttonText}>LOGOUT</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}
            onPress={() => navigation.navigate('Menu')}
            disabled={false}
            activeOpacity={0.7}
            underlayColor="#EFEFEF"
          >
            <Text style={styles.buttonText}>MENU</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // Scale the image to cover the entire screen
    justifyContent: 'center', // Center vertically
  },
  container: {
    flex: 1,
    padding: 10,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingBottom: 5,
    marginBottom: 10,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  dataCell: {
    flex: 1,
    textAlign: 'center',
  },
  dataCellName: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'green',
  },
  dataCellBold: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'red',
  },
  buttonContainer: {
    borderRadius: 35, // Border radius 
    justifyContent: 'center', // Center vertically
    width: '50%',
    padding: 10,
    fontSize: 50,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    paddingBottom: 5,
    justifyContent: 'space-between',
    marginTop: 80,
  },
  button: {
    height: 36, // Adjust the height as needed
    //backgroundColor: '#2196F3', // Example background color
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    width: '47%',
    marginTop: 60,
    //backgroundColor: '#007AFF',
    //backgroundColor: '#216d94',
    backgroundColor: '#227fe3',
  },
  buttonText: {
    color: '#E0E0E0', // Example text color
    fontSize: 12,
    fontWeight: 'bold',
  },
  buttonLogout: {
    height: 36, // Adjust the height as needed
    //backgroundColor: '#2196F3', // Example background color
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    width: '47%',
    // marginBottom: 16,    
    marginTop: 60,
    //backgroundColor: '#8a2b08',
    backgroundColor: '#9e3b34'
  },
  norecordsView: {
    alignItems: 'center',
  },
  norecordsText: {
    color: 'red', // Example text color
    fontSize: 16,
    fontWeight: 'bold',

  },

  banner: {
    fontSize: 30,
    marginTop: 5,
    marginBottom: 40,
    textShadowColor: "blue",
    fontWeight: 'bold',
    color: '#227fe3',
    alignItems: 'center',
  },
  playerCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  playerCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    width: '30%', // Adjust the width as needed
    // Other card styles...
  },
  playerName: {
    fontWeight: 'bold',
    marginBottom: 5,
    // Other styles for player name...
  },

});

export default DynamicScoresDisplay;
