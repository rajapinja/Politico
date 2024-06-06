import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import BASE_URL from '../app/Config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const StatePicker = ({ selectedValue, onValueChange }) => {

  const [states, setStates] = useState([]);
  const [jwtToken, setJwtToken] = useState('');

 // Always retrieve accessToken from AsyncStorage
 useEffect(() => {
  retrieveValues();
}, []);

// Function to retrieve values from AsyncStorage  
const retrieveValues = async () => {
  try {
    const accessToken = await AsyncStorage.getItem('accessToken');
    setJwtToken(accessToken.trim());
  } catch (error) {
    console.error('Error retrieving values:', error);
  }
};

// Define the headers with the access token
const headers = {
  'Authorization': `Bearer ${jwtToken}`,
  'Content-Type': 'application/json',
};

 useEffect(() => {    
  if(jwtToken){
    fetchStates(); 
  }      
}, [jwtToken]);


const fetchStates = async () => {    
  //console.log("headers.Authorization :", headers.Authorization);
  await axios.get(`${BASE_URL}/api/states`, { headers: headers })
  .then(response => {
    console.log(response.data.states);
    setStates(response.data.states);
  })
  .catch(error => {
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
  });
};

if (!states || states.length === 0) {
return <Text color="red">Loading states...</Text>;
}

return (
  <View style={styles.input}>
    <Picker
      selectedValue={selectedValue}       
      onValueChange={onValueChange}
    >
      <Picker.Item label="Select State" value="" style={styles.pickerText}/>      
      {states.map((item, index) => (               
              <Picker.Item style={styles.pickerText}
                  key={index}
                  label={item.name}
                  value={item.name}                    
              />
          ))}        
    </Picker>
    {/* <Text>{selectedValue}</Text> */}
  </View>
);
};

const styles = StyleSheet.create({
  picker: {
      height: 50,
      width: '100%',
  },
  input: {
    width: 180,
    //padding: 10,
    borderWidth: 1, // Apply border
    borderColor: 'gray', // Border color
    borderRadius: 5, // Border radius
    textAlign: 'center',
    marginBottom: 6,
    fontSize: 12,
    height: 40,
    //:'blue'
  }, 
  pickerText:{     
    fontSize: 12,      
    //textAlign:'center'
}
});

export default StatePicker;
