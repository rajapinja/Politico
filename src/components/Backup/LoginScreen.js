import React, { useState } from 'react';
import { View, TextInput, Text, Button, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import BASE_URL from '../app/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GradientBanner from '../components/GradientBanner';

// Inside your login logic
import { useUserContext } from '../app/UserContext';

import backgroundImage from '../images/beach-832346_1280.jpg';


const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessages, setErrorMessages] = useState({});

  // Assuming responseData is the JSON response from the login API
  const { setUser, setRole } = useUserContext();

  const navigation = useNavigation();

  const validateUsername = (text) => {
    if (text.length < 4) {
      return 'Username must be at least 5 characters';
    }
    return null; // No error
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    return '';
  };

  const handleLogin = async () => {    
    
    const errors = {};

    if (!username) {
      errors.username = 'Username is required';
    }

    const userError = validateUsername(username);
    if(userError){
      errors.username = userError;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      errors.password = passwordError;
    }

    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
    } else {

      await axios.post(`${BASE_URL}/api/userlogin`, {
        username: username,
        password: password,        
      }).then(response => {    

          console.log('Login Successful', response.data.message);
          console.log("User :", response.data.user); 
          console.log("Role :", response.data.role);  
          
          // Get the current timestamp
          const loginTime = new Date().getTime().toString();
          // Set the login time in AsyncStorage
          AsyncStorage.setItem('loginTime', loginTime);
          
          setPassword('');
          setUsername('');         
          setUser(response.data.user);
          setRole(response.data.role); 
          //console.log("AccessToken : ", response.data.accessToken)
          // if(response.data && response.data.accessToken !== null){
          //     console.log("AccessToken : ", response.data.accessToken)
          //     AsyncStorage.setItem('accessToken', response.data.accessToken); 
          // }
          // Define the key-value pairs you want to set
          //  trim any white spaces          
          const keyValues = [
            { key: 'accessToken', value: response.data.accessToken },
            { key: 'loginTime', value: loginTime },            
          ];

          // Use Promise.all to set multiple items asynchronously
          // const setItemPromises = keyValues.map(async ({ key, value}) => {
          //   try {
          //     await AsyncStorage.setItem(key, value);
          //     console.log(`Successfully set ${key}`);
          //   } catch (error) {
          //     console.error(`Error setting ${key}:`, error);
          //   }
          // });

          //  // Wait for all promises to complete
          //   Promise.all(setItemPromises)
          //   .then(() => {
          //     console.log('All items set successfully.');
          //   })
          //   .catch(error => {
          //     console.error('Error setting items:', error);
          //   });
          //navigation.navigate('Menu'); // or 'GetPlayer' based on your requirement       
         
          const setItemPromises = keyValues.map(async ({ key, value }) => {
            try {
              await AsyncStorage.setItem(key, value);
              console.log(`Successfully set ${key}`);
              return true; // Return a resolved promise for success
            } catch (error) {
              console.error(`Error setting ${key}:`, error);
              return false; // Return a rejected promise for failure
            }
          });
          
          // Wait for all promises to complete
          Promise.all(setItemPromises)
            .then((results) => {
              // Check if all promises succeeded
              if (results.every((result) => result)) {
                console.log('All items set successfully.');
              //navigation.navigate('Menu'); // or 'GetPlayer' based on your requirement
                navigation.navigate('CreateGame');
              } else {
                console.error('Some items failed to be set.');
                // Handle partial failure here if needed
              }
            })
            .catch((error) => {
              console.error('Error setting items:', error);
            });
          
          
      }).catch(error => {    
        setPassword('');
        setUsername('');            
        if (error.response) {
          // Handle response-related errors
          console.error('Response:', error.response);
        } else if (error.request) {
          // Handle request-related errors
          console.error('Request:', error.request);
        } else {
          // Handle other errors
          console.error('Other Error:', error.message);
        }    
    })
   }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.overlay}>   
        <View style={styles.container}>
       <GradientBanner text='Score Recorder'/>
          <Text style={styles.title}>Login</Text>  
            <TextInput
              placeholder="Username"
              placeholderTextColor="gray"
              value={username}
              onChangeText={setUsername}
              style={[styles.input, { color: '#FFFFFF' }]} // Set the text color to black
            />
            {errorMessages.username && <Text style={styles.errorText}>{errorMessages.username}</Text>}
            <TextInput
              placeholder="Password"
              placeholderTextColor="gray"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={[styles.input, { color: '#ffffff' }]} // Set the text color to black
            />
            {errorMessages.password && <Text style={styles.errorText}>{errorMessages.password}</Text>}
          
            <TouchableOpacity style={styles.button} 
              onPress={handleLogin}
              disabled={false}
              activeOpacity={0.7}
              underlayColor="#EFEFEF"
            >    
              <Text style={styles.buttonText}>LOGIN</Text>   
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  title: {
    fontSize:16,
    marginTop: 180,
    textShadowColor:"blue",
    fontWeight: 'bold',  
    marginBottom:4,        
  },

  banner: {
    fontSize:34,
    marginTop: 5,
    marginBottom:140,
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
  
  buttonContainer: {
    borderRadius: 15, // Border radius 
    width: '62%',
    padding: 10,
    fontSize:50,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
  },
  button: {
    height: 36, // Adjust the height as needed
    //backgroundColor: '#2196F3', // Example background color
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 13,
    width: '62%',
    marginBottom: 180,    
    backgroundColor: '#007AFF'
  },
  buttonText: {
    color: '#E0E0E0', // Example text color
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
