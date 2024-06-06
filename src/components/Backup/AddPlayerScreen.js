
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, TextInput, Button, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BASE_URL from '../app/Config';
import GradientBanner from '../components/GradientBanner';
import AsyncStorage from '@react-native-async-storage/async-storage';

import backgroundImage from '../images/magnolia-trees-556718_1280.jpg';


function AddPlayer() {

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [message, setMessage] = useState("");
  const [jwtToken, setJwtToken] = useState('');
  // Call the onPlayerAdded function if available  //Use Navigation 
  const navigation = useNavigation();

  // Always retrieve accessToken from AsyncStorage
  useEffect(() => {    
    retrieveValues();    
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

  const handleAddPlayer = async () => {
    try {
      //retrieveValues();
      console.log("headers.Authorization :", headers.Authorization);
      await axios.post(`${BASE_URL}/api/add_player`, JSON.stringify({ name, mobile }), {headers:headers}
      ).then(response => {
          setMessage('Player added successfully!');
          setName('');
          setMobile('');
          navigation.navigate('Menu');       
        }).catch(error => {
          setMessage('Error adding player.');
          console.error('Error adding player:', error);
        });     
    } catch (error) {
      console.error('Error adding player:', error);
    }
  };


  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
    <View style={styles.container}>
    <GradientBanner text='Score Recorder'/>
      <Text style={styles.title}>Add Player</Text>      
      <TextInput style={styles.input}
        placeholder="Enter Name"
        placeholderTextColor="#696969"
        value={name}
        onChangeText={setName}
      />
      <TextInput style={styles.input}
        placeholder="Mobile Number"
        placeholderTextColor="#696969"
        value={mobile}
        onChangeText={setMobile}
      />      
      <TouchableOpacity style={styles.button} 
        onPress={handleAddPlayer}
        disabled={false}
        activeOpacity={0.7}
        underlayColor="#EFEFEF"
      >   
        <Text style={styles.buttonText}>ADD PLAYER</Text>  
      </TouchableOpacity>   
      {message ? <Text>{message}</Text> : null}
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // Scale the image to cover the entire screen
    justifyContent: 'center', // Center vertically
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize:18,
    marginBottom: 10,
    textShadowColor:"blue",
    fontWeight: 'bold',    
    marginTop: 120,     
  },
  banner: {
    fontSize:18,
    marginTop: 5,
    marginBottom:80,
    textShadowColor:"blue",
    fontWeight: 'bold', 
    color: 'gray',        
  },
  input: {
    width: '50%',
    padding: 10,
    borderWidth: 2, // Apply border
    borderColor: 'gray', // Border color
    borderRadius: 5, // Border radius
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 16,
    height: 36,
  },
  button: {
    height: 36, // Adjust the height as needed
    //backgroundColor: '#2196F3', // Example background color
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    width: '50%',
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
    width: '50%',
    marginBottom: 120,    
    //backgroundColor: '#8a2b08',
    backgroundColor: '#9e3b34'
  },
});

export default AddPlayer;
