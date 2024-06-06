import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ImageBackground } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import BASE_URL from '../app/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GradientBanner from '../components/GradientBanner';
import backgroundImage from '../images/clouds-1282314_1280.jpg';

function RecordScores() {

  const [roundNumber, setRoundNumber] = useState(1);  
  const [roundNumberMax, setRoundNumberMax] = useState('');  
  const [score, setScore] = useState('')
  const [scoresSubmitted, setScoresSubmitted] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);
  const [players, setPlayers] = useState([]);
  const [jwtToken, setJwtToken] = useState('');
  const [headersValue, setHeadersValue] = useState({});

  const navigation = useNavigation();
 
  // Always retrieve accessToken from AsyncStorage
  useEffect(() => {    
    retrieveValues(); 
    fetchPlayers();  
    fetchRoundNumber();   
  }, []);  

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

//setHeadersValue(headers);
  // // Fetch Playerrs data
  // useEffect(() => {
  //   fetchPlayers();
    
  // }, []);

  
  // Always get latest round number from DB
  // useEffect(() => {    
  //   fetchRounNumber();    
  // }, []);


  // useEffect(() => {     
  //   fetchPlayers();  
  //   fetchRoundNumber(); 
  // }, [headers.Authorization]);  
  
  const fetchPlayers = async () => {
    try {
      console.log("headers.Authorization :", headers.Authorization);
      const response = await axios.get(`${BASE_URL}/api/players`, headers);
      setPlayers(response.data.players);      
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };
  
  const fetchRoundNumber = async () => {
    try {
      console.log("headers.Authorization :", headers.Authorization);
      const response = await axios.get(`${BASE_URL}/api/round-number`, headers);
      console.log('Response data roundNumber:', response.data.roundNumber);
      console.log('Response:', response.data.message);
      setResponseMessage(response.data.message);
      setRoundNumberMax(response.data.roundNumber);
      setRoundNumber(response.data.roundNumber + 1);
      setScore('');
    } catch (error) {
      console.error('Error fetching roundNumber:', error);
      setScore('');
    }
  };
  
 
  const handleSaveScores = async () => {

     let allScoresEntered = true;
    // Checck Round Number < = 7 only
    // if(roundNumber > 7){
    //   alert("please clear data, the round number is more than 7, you might have reached the winning stage of a player");
    //   return
    // }
  
    players.forEach(item => {
      if (item.score === undefined || item.score === null || item.score === '') {
        allScoresEntered = false;
        item.score ='';
       //setScore('');
        return;
      }
    });
  
    if (!allScoresEntered) {      
      alert("Missing scores for players, Please enter score for all the players");
      return;
    }
  
    try {
      const response = await axios.post(`${BASE_URL}/api/record_score`,headers, players);
      console.log('Response data:', response.data);
      setRoundNumber(roundNumber + 1);
      setScore('');
      setScoresSubmitted(true);
      setPlayers([])
      navigation.navigate('Menu');
    } catch (error) {
      console.error('Error recording score:', error);
      setScore('');
    }
  };

  const handleScoreChange = (playerId, score) => {
    // Update the score for the specific player
    const updatedPlayers = players.map(player =>
      player.id === playerId ? { ...player, player_id:playerId, round_number:roundNumber, score:score } : player     
    );   
    setPlayers(updatedPlayers)
  };
  
const  renderItem=({ item }) => {
       return (    
          <View style={styles.dataRow}>
            <Text style={styles.dataCellName}>{item.name}</Text>
            {!item.isValid && <Text style={{ color: 'red' }}>**</Text>}
            <TextInput 
              placeholder="Enter score" 
              placeholderTextColor="#660c96"
              value={item.score}
              onChangeText={(score) => handleScoreChange(item.id, score)}
              style={{flex: 1, textAlign: 'center', borderColor: item.isValid ? 'black' : 'grey', borderWidth: 2 }}
            />                
          </View>         
        )
};
  return (
      <ImageBackground source={backgroundImage} style={styles.background}>
        <View style={styles.container}>
        <GradientBanner text='Score Recorder'/>
            <View style ={styles.title}>
              <Text style ={styles.title}>Round Number</Text>
              <Text style ={styles.txtcontent}>{roundNumber}</Text>       
            </View>
            <View style={styles.headerRow}>
              <Text style={styles.headerCell}>Player Name</Text>
              <Text style={styles.headerCell}>Score</Text>  
            </View>  
           
            <FlatList style={styles.flatListWrapper}
              data={players}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}      
            /> 
             {/* {  Array.isArray(players) && players.length > 0  && //    <Text>{jwtToken}</Text>*/ }
            <View  style={styles.buttonRow}>              
                {scoresSubmitted ? (
                  <Text style={styles.success}>Scores submitted successfully!</Text>
                ) : (
                  <TouchableOpacity style={styles.button} 
                      onPress={handleSaveScores}
                      disabled={false}
                      activeOpacity={0.7}
                      underlayColor="#EFEFEF"
                    >    
                    <Text style={styles.buttonText}>SAVE SCORES</Text>   
                  </TouchableOpacity>
                )}
             </View>
          {/* }{ Array.isArray(players) && players.length === 0 &&
                <View style={styles.norecordsView}>
                    <Text style={styles.norecordsText}>{responseMessage}</Text>
                </View>          
            } */}
            <View  style={styles.buttonRow}>              
              <TouchableOpacity style={styles.button} 
                    onPress={() => navigation.navigate('Menu')}
                    disabled={false}
                    activeOpacity={0.7}
                    underlayColor="#EFEFEF"
                  >    
                  <Text style={styles.buttonText}>MENU</Text>   
                </TouchableOpacity>               
          
              <TouchableOpacity style={styles.buttonLogout} 
                    onPress={() => navigation.navigate('Logout')}
                    disabled={false}
                    activeOpacity={0.7}
                    underlayColor="#EFEFEF"
                  >    
                  <Text style={styles.buttonText}>LOGOUT</Text>   
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
        padding: 20, 
        textAlign: 'center',   
        //backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 16,
        marginBottom: 10,
        fontWeight: 'bold',
        color:'blue',
        justifyContent: 'space-between',
        flexDirection: 'row', 
        marginTop: 20,
      },
      banner: {
        fontSize:30,
        marginTop: 5,
        marginBottom:30,
        textShadowColor:"blue",
        fontWeight: 'bold', 
        color: 'gray',        
      },
      input: {
        width: '60%',
        padding: 10,
        borderWidth: 2, // Apply border
        borderColor: 'gray', // Border color
        borderRadius: 5, // Border radius
        textAlign: 'center',
        marginBottom: 16,
        fontSize: 16,
        height: 36,
      },

    txtcontent: {
        fontSize: 28,
        marginBottom: 20,
        fontWeight: 'bold',
        color:'red',
        textAlign: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        paddingBottom: 5,
        marginBottom: 10,
        justifyContent: 'space-between',
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
        justifyContent: 'space-between',
    },
    dataCell: {
        flex: 1,
        textAlign: 'center',
    },
    dataCellName: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
        color:'#0c2f96',
        fontSize: 25,
    },
    dataCellBold: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
        color:'red',
    },    
    item: {
        marginBottom: 10,
        fontSize: 18,
    },
    flatListWrapper: {
        flex: 1,
        marginBottom: 10,
    }, 
    success: {
      fontSize: 25,      
      fontWeight: 'bold',
      textAlign: 'center',
      color:'green',
  },
  
  buttonContainer: {     
    //flexDirection: 'row',
   // flex: 2,
    borderRadius: 35, // Border radius 
    justifyContent: 'center', // Center vertically
    width: '50%',
    padding: 10,
    fontSize:14,
    marginBottom: 300,                
  },
  buttonRow: {
    flexDirection: 'row',     
    paddingBottom: 3,
    justifyContent: 'space-between',
},
button: {
  height: 36, // Adjust the height as needed
  //backgroundColor: '#2196F3', // Example background color
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 15,
  width: '47%',
  marginBottom: 16,    
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
  marginBottom: 140,    
  //backgroundColor: '#8a2b08',
  backgroundColor: '#9e3b34'
}, norecordsView:{        
  alignItems: 'center',
},
norecordsText:{
  color: 'red', // Example text color
  fontSize: 16,
  fontWeight: 'bold', 
  marginBottom: 20,
},

});
export default RecordScores;
