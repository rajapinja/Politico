import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Text, Alert} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import BASE_URL from '../app/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GradientBanner from '../components/Header';
import backgroundImage from '../images/iceland-1979445_1280.jpg';
import Footer from '../components/Footer';
import DistrictPicker from '../components/DistrictPicker';
import StatePicker from '../components/StatePicker';
import CountryPicker from '../components/CountryPicker';
import DateInput from '../components/DateInput';
import TextArea from '../components/TextArea';


const CandidateScreen = ({navigation}) => {

    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [qualification, setQualification] = useState('');
    const [assetsValue, setAssetsValue] = useState('');
    const [party, setParty] = useState('');
    const [address, setAddress] = useState('');
    const [district, setDistrict] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');    
    const [jwtToken, setJwtToken] = useState('');
    const [message, setMessage] = useState("");

   // const navigation = useNavigation();
  
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
   
    const handleSubmit = async () => {
        try{
            // Assuming your dateOfBirth state is a Date object, format required by mySQL YYYY-MM-DD
            //const formattedDateOfBirth = dateOfBirth.toISOString().split('T')[0]; // Format as YYYY-MM-DD
            // Send data to the backend Flask API here (POST request)
            console.log("headers.Authorization :", headers.Authorization);
            if(jwtToken){
                    await axios.post(`${BASE_URL}/api/candidates`,    
                    JSON.stringify({name, age, dateOfBirth, qualification, assetsValue, party, address, district, state, country}),  
                    {headers: headers})
                .then((response) =>  {
                    setMessage(response.data.message);
                    console.log(response.data.message)
                    clearFields();
                    navigation.navigate('Upload');
                }).catch((error) => {
                        console.error('Error:', error);
                        // Handle error response (if needed)
                });         
            }  
        }catch (error) {
            console.error('Error adding candidate :', error);
          }     
    };

    const clearFields = () => {
        setName('');      
        setAge('');       
        setQualification('');    
        setAssetsValue('');
        setParty('');
        setDateOfBirth('');
        setAddress('');
        setCountry('Select Country');
        setDistrict('Select District');
        setState('Select State');
    };        

    const formatAsDDMMYYYY = (date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based, so we add 1
        const year = date.getFullYear();
        
        return `${year}-${month}-${day}`; // required format for MySQL DB Date
        //return `${day}/${month}/${year}`;
      };
      
      const handleDateOfBirthChange = (selectedDate) => {
        console.log('Home Screen Selected Date: ', selectedDate); // Check if the selected date is received
        setDateOfBirth(formatAsDDMMYYYY(selectedDate));
        //Alert.alert("Selected Date :",formatAsDDMMYYYY(selectedDate))
      };

    return (
        <ImageBackground source={backgroundImage} style={styles.background}>
            <GradientBanner text='Politico' />           
            <View style={styles.container}>
                <View style={styles.pageContent}>
                    <Text style={styles.title}>Candidate</Text>                

                    <View style={styles.InputRow}>
                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            value={name}
                            onChangeText={setName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Age"
                            value={age}
                            onChangeText={setAge}
                        />   
                    </View>                    
                    <View style={styles.InputRow}> 
                        <TextInput
                            style={styles.input}
                            placeholder="Qualification"
                            value={qualification}
                            onChangeText={setQualification}
                        />
                         <TextInput
                            style={styles.input}
                            placeholder="AssetsValue(Rs.)"
                            value={assetsValue}
                            onChangeText={setAssetsValue}
                        />
                       
                    </View>                  
                    <View style={styles.InputRow}>
                       
                        <TextInput
                            style={styles.input}
                            placeholder="Party Name"
                            value={party}
                            onChangeText={setParty}
                        />
                          <DateInput
                             onSelectedDate={handleDateOfBirthChange}                                              
                        />  
                    </View>  
                       
                    <View style={styles.InputRow}> 
                        <TextArea style={styles.input} 
                        value={address}                      
                        onChange={(newAddress) => setAddress(newAddress)}
                        />                       
                    </View>
                    <View style={styles.InputRow}> 
                       
                        <DistrictPicker
                            selectedValue={district}
                            onValueChange={(itemValue) => setDistrict(itemValue)}
                        />
                    </View>
                    <View style={styles.InputRow}> 
                        <StatePicker
                            selectedValue={state}
                            onValueChange={(itemValue) => setState(itemValue)}
                        />
                    
                   </View>
                   <View style={styles.InputRow}> 
                      
                        <CountryPicker
                            selectedValue={country}
                            onValueChange={(itemValue) => setCountry(itemValue)}
                        />
                   </View>
                   <View style={styles.InputRow}>
                   <TouchableOpacity style={styles.button}
                        onPress={handleSubmit}
                        disabled={false}
                        activeOpacity={0.7}
                        underlayColor="#EFEFEF"
                    >
                        <Text style={styles.buttonText}>SUBMIT</Text>
                    </TouchableOpacity>                      
                   </View>                
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
    datePickerContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
      },

      InputContainer: {
        borderRadius: 20, // Border radius 
        justifyContent: 'center', // Center vertically
        width: '50%',
        padding: 10,
        fontSize: 50,
      },
      InputRow: {
        flexDirection: 'row',
        paddingBottom: 5,
        justifyContent: 'space-between',       
      },
    
      input: {    
        height: 38, 
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 12,
        borderRadius: 5,       
        width: '49%',
        marginBottom: 8,       
        marginRight:10,
        borderWidth: 1,
        borderColor: 'gray',
        textAlign: 'center',
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

export default CandidateScreen;
