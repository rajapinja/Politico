import React, { useState, useRef, useCallback  } from 'react';
import { View, StyleSheet, Text, ImageBackground, TouchableOpacity, Alert, Button } from 'react-native';
import GradientBanner from '../components/Header';
import backgroundImage from '../images/clouds-1282314_1280.jpg';
import Footer from '../components/Footer';
import { useRoute } from '@react-navigation/native';
import { useTheme } from '../app/LightDarkContext';
import DraggableRadio from '../components/DraggableRadio';



const HomeScreen = ({ navigation }) => {

  const [district, setDistrict] = useState('');
  const route = useRoute();
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [refresh, setRefresh] = useState(false);

  const { theme, toggleTheme } = useTheme();

  const handleSwipe = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  const formatAsDDMMYYYY = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based, so we add 1
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const handleDateOfBirthChange = (selectedDate) => {
    console.log('Home Screen Selected Date: ', selectedDate); // Check if the selected date is received
    setDateOfBirth(formatAsDDMMYYYY(selectedDate));
  };

  const handleSelect = (option) => {
    console.log('Selected option:', option);
  };


  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <GradientBanner text='Politico' />
      {/* <View style={styles.container}> */}
      {/* <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}> */}
        <View style={styles.container}>
          <View style={styles.topRight}>
          <DraggableRadio />
            {/* <GradientButton
              onPress={toggleTheme}
              title={'theme'}
              colors={['black', 'lightgray']} // Your custom color combination
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}             
            /> */}
            {/* <TouchableOpacity style={styles.buttonTheme}
              onPress={toggleTheme}
              disabled={false}
              activeOpacity={0.7}
              underlayColor="#EFEFEF"
            >
              <Text style={{ color: theme.textColor }}>theme</Text>
          </TouchableOpacity> */}
          </View>
         
            <Text style={{...styles.title, color: theme.textColor }}>***** About Politico *****</Text>
            <Text style={{ ...styles.paragraph, color: theme.textColor }}>
              This App is check, varify and velidate the ectoral results of specific year
              of specific state in a country (India). Its gives complete details about a constituency and its MLA / MP
              candidate details, and candidates compete each other from different parties and accquired votes of a person
              and wheathe they hold their deposits are notm and their majority of the votes they received.

              This is going to be a complete in-and-out picture of electoral results. More features will be added-up, and this App
              will have continuous enhancement. It will accept input(s) from users to stay up with latest information.
            </Text>
          
        </View>
      {/* </View> */}
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
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topRight: {
    position: 'absolute',
    top: 2,
    right: 0,
    zIndex: 999,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 24,
    textAlign: 'center',
    color: 'black', // Set your desired text color here
  },
  buttonTheme:{
    height:20,
    backgroundColor:'gray',
    width:50,
    borderRadius:13,
    alignContent:'center',
    alignItems:'center'
  },
  buttonText: {
    color: 'darkgray', // Example text color
    fontSize: 12,
    fontWeight: 'bold',
    
  },

});

export default HomeScreen;
