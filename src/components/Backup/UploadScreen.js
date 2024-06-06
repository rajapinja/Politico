import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Text, Alert, NativeModules } from 'react-native';
import DocumentUploadModal from '../components/DocumentUploadModal'; // Assuming the location of your DocumentUploadModal file
import axios from 'axios';
import BASE_URL from '../app/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GradientBanner from '../components/Header';
import backgroundImage from '../images/iceland-1979445_1280.jpg';
import Footer from '../components/Footer';
import { NativeDocumentPicker } from 'react-native-document-picker'; // Ensure the correct path to your DocumentPickerResponse module


const UploadScreen = (navigation) => {

  const [jwtToken, setJwtToken] = useState('');
  const [selectedDocs, setSelectedDocs] = useState([]);  

  //const { RNDocumentPicker } = NativeModules;
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

  const handleSaveDocuments = async (selectedDocs) => {
    try{
      // Send documents to the backend Flask API here (POST request)
      // Handle the documents here, for example, send them to your backend
      console.log('Documents to save:', selectedDocs);
      // You can now send this 'documents' object to your backend for saving
      console.log("headers.Authorization :", headers.Authorization);
      if(jwtToken){
              await axios.post(`${BASE_URL}/api/upload`,    
              JSON.stringify({selectedDocs}),  
              {headers: headers})
          .then((response) =>  {
              setMessage(response.data.message);
              console.log(response.data.message)
              clearFields();
              navigation.navigate('Menu');
          }).catch((error) => {
                  console.error('Error:', error);
                  // Handle error response (if needed)
          });         
      }  
  }catch (error) {
      console.error('Error adding candidate :', error);
    }      
  };

  const handleDocumentPicking = async () => {
    try {
      const response = await NativeDocumentPicker.pick({});
      if (response && response.length > 0) {
        setSelectedDocs(response);
      } else {
        Alert.alert('No documents selected');
      }
    } catch (error) {
      console.error('Document picking error:', error);
      Alert.alert('Error picking document');
    }
  };


  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <GradientBanner text='Politico' />           
        <View style={styles.container}>
          <View style={styles.pageContent}>
            <Text style={styles.title}>Upload - Document Proofs</Text>  
              <DocumentUploadModal
                selectedDocuments={selectedDocs}
                onDocumentPick={handleDocumentPicking}
              />
          </View>
        </View>
        <Footer />
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
      paddingHorizontal: 20,
  },
  title: {
      fontSize: 20,
      textShadowColor: "blue",
      fontWeight: 'bold',
      marginBottom: 16,
      marginTop:0
  },
 
  pageContent: {
      flex: 1, // Ensure content fills the remaining space
      marginTop: 0, // Set the margin top to 0
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 60,
  },
 
   
    button: {    
      height: 36, 
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 13,
      width: '49%',
      marginBottom: 26,
      backgroundColor: '#227fe3',
      
    },
    buttonText: {
      color: '#E0E0E0', // Example text color
      fontSize: 12,
      fontWeight: 'bold',
    },
    scrollViewContainer: {
      flexGrow: 1,
    },
});
export default UploadScreen;
