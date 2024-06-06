import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, ImageBackground, Text, FlatList } from 'react-native';
import axios from 'axios';
import BASE_URL from '../app/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GradientBanner from '../components/Header';
import backgroundImage from '../images/iceland-1979445_1280.jpg';
import Footer from '../components/Footer';
import DistrictPicker from '../components/DistrictPicker';
import GradientButton from '../components/GradientButton';
import ConstitutionPicker from '../components/ConstitutionPicker';


const EditConstitutionScreen = ({ navigation }) => {


    const [jwtToken, setJwtToken] = useState('');
    const [message, setMessage] = useState("");
    const [constitution, setConstitution] = useState("");
    const [constitutions, setConstitutions] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [constitutionInfo, setConstitutionInfo] = useState([]);
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

    // Fetch constitutions when jwtToken or selectedDistrict changes
    useEffect(() => {
        if (jwtToken && selectedDistrict) {
            fetchConstitutions();
        }
    }, [jwtToken, selectedDistrict]);


    const fetchConstitutions = async () => {
        // console.log("headers.Authorization :", headers.Authorization);
        await axios.get(`${BASE_URL}/api/constitutions?district=${selectedDistrict}`, { headers: headers })
            .then(response => {
                //console.log(response.data.districts);
                setConstitutions(response.data.constitutions);
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

    const fetchConstitutionDetails = async () => {
        try {
            //console.log("headers.Authorization :", headers.Authorization);
            if (jwtToken) {
                await axios.get(`${BASE_URL}/api/constitutioninfo?constitution=${constitution}`, { headers: headers })
                    .then((response) => {
                        setConstitutionInfo(response.data.constitutioninfo);
                        console.log(response.data.constitutioninfo)
                        console.log(response.data.message)
                    }).catch((error) => {
                        console.error('Error:', error);
                    });
            }
        } catch (error) {
            console.error('Error adding candidate :', error);
        }
    }

    const renderItem = ({ item }) => (
        <View style={styles.dataRow}>
            <Text style={styles.input}>{item.id}</Text>
            <TextInput
                placeholder={item.name}
                placeholderTextColor="#660c96"
                value={item.name} // Convert score to string for input value
                onChangeText={name => handleChange(item.id, name)}
                style={{
                    flex: 1,
                    textAlign: 'center',
                    borderColor: 'black',
                    borderWidth: 2,
                    borderRadius: 5,
                    height: 26,
                }}
            />
            <TextInput
                placeholder={item.district}
                placeholderTextColor="#660c96"
                value={item.district} // Convert score to string for input value
                onChangeText={district => handleChange(item.id, district)}
                style={{
                    flex: 1,
                    textAlign: 'center',
                    borderColor: 'black',
                    borderWidth: 2,
                    borderRadius: 5,
                    height: 26,
                }}
            />
            <TextInput
                placeholder={item.reserved}
                placeholderTextColor="#660c96"
                value={item.reserved} // Convert score to string for input value
                onChangeText={reserved => handleChange(item.id, reserved)}
                style={{
                    flex: 1,
                    textAlign: 'center',
                    borderColor: 'black',
                    borderWidth: 2,
                    borderRadius: 5,
                    height: 26,
                }}
            />
            {/* <TextInput
                placeholder={item.total_votes.toString()}
                placeholderTextColor="#660c96"
                value={item.total_votes.toString()} // Convert score to string for input value
                onChangeText={total_votes => handleChange(item.id, total_votes)}
                style={{
                    flex: 1,
                    textAlign: 'center',
                    borderColor: 'black',
                    borderWidth: 2,
                    borderRadius: 5,
                    height: 26,
                }}
            /> */}
        </View>
    );

    const handleChange = (id, name, district, reserved, total_votes) => {
        console.log("Updated Constitution Details :", id, name, district, reserved, total_votes);
        // const updatedPlayers = playerScores.map(player =>
        //   String(player.player_id) === String(playerId) ? {
        //     ...player,
        //     player_id: playerId,
        //     round_number: player.round_number || roundNumber,
        //     score:score
        //   }
        //     : player
        // );
        // setPlayerScores(updatedPlayers);
    };

    const handleSave = async () => {
        console.log("Updated Constitution Details :", constitutionInfo);
        // try {          
        //   axios.post(`${BASE_URL}/api/update_score`, playerScores, { headers }
        //   ).then(response => {
        //     setScoresSubmitted(true);
        //   }).catch(error => {
        //     console.error('Error fetching player scores:', error);
        //   });
        //   navigation.navigate('Menu');
        //   Alert.alert('Success', 'Scores updated successfully');
        // } catch (error) {
        //   console.error('Error saving player scores:', error);
        //   Alert.alert('Error', 'Failed to update scores');
        // }
    };


    return (
        <ImageBackground source={backgroundImage} style={styles.background}>
            <GradientBanner text='Politico' />
            <View style={styles.container}>
                <View style={styles.pageContent}>
                    <Text style={styles.title}>Edit Constitution</Text>
                    <View style={styles.InputRow}>
                        <DistrictPicker
                            selectedValue={selectedDistrict}
                            onValueChange={(itemValue) => {
                                setSelectedDistrict(itemValue),
                                fetchConstitutions
                            }}
                        />
                    </View>fet
                    {(selectedDistrict && jwtToken) && (
                        <View style={styles.InputRow}>
                            <ConstitutionPicker
                                selectedValue={constitution}
                                onValueChange={(itemValue) => setConstitution(itemValue)}
                                selectedDistrict={selectedDistrict}
                                fetchedConstitutions={constitutions}
                            />
                        </View>
                    )}
                    <View style={styles.InputRow}>
                        <GradientButton
                            onPress={fetchConstitutionDetails}
                            title={'EDIT~CONSTITUTION'}
                            colors={['#0000FF', '#50C878']}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 0 }}
                            buttonStyle={styles.buttonConstitution}
                        />
                    </View>
                    {/* <View style={styles.rowWrapper}>
                        <FlatList
                            style={styles.flatListWrapper}
                            data={constitutionInfo}
                            keyExtractor={(item) => item.id}
                            renderItem={renderItem}
                            ListHeaderComponent={() => (
                                <View style={styles.headerRow}>
                                    <Text style={styles.headerCell}>Constitution Name</Text>
                                    <Text style={styles.headerCell}>district</Text>
                                    <Text style={styles.headerCell}>total_votes</Text>
                                    <Text style={styles.headerCell}>reserved</Text>
                                </View>
                            )}
                            ListEmptyComponent={() => (
                                <View style={styles.container}>
                                    <Text>No scores found</Text>
                                </View>
                            )}
                        />
                    </View> */}
                    {/* <View style={styles.InputRow}>
                        <GradientButton
                            onPress={handleSave}
                            title={'SAVE~CONSTITUTION'}
                            colors={['#0000FF', '#50C878']}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 0 }}
                            buttonStyle={styles.buttonConstitution}
                        />
                    </View> */}
                </View>
            </View>
            <Footer />
        </ImageBackground>
    );

};

export default EditConstitutionScreen;

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
    pageContent: {
        flex: 1, // Ensure content fills the remaining space
        marginTop: 0, // Set the margin top to 0
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
    },
    flatListWrapper: {
        flex: 1,
        marginBottom: 16,
    },
    rowWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap', // Allow content to wrap
    },
    dataRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        paddingBottom: 5,
        marginBottom: 10,
        justifyContent: 'space-between',
    },
    dataCell: {
        flex: 1,
        textAlign: 'center',
    },
    dataCellName: {
        flex: 1,
        textAlign: 'center',
        color: '#0c2f96',
        fontSize: 12,
    },
    title: {
        fontSize: 20,
        textShadowColor: "blue",
        fontWeight: 'bold',
        marginBottom: 16,
        marginTop: 2
    },
    dataCellBold: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'red',
    },
    item: {
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
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
    flatListWrapper: {
        flex: 1,
        marginBottom: 20,
    },
    rowWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap', // Allow content to wrap
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
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'gray',
        textAlign: 'center',
    },
    buttonConstitution: {
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 13,
        width: '54%',
        marginBottom: 60,
        backgroundColor: '#227fe3',
        marginRight: 10
    },
    button: {
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 13,
        width: '47%',
        marginBottom: 26,
        backgroundColor: '#227fe3',
        marginRight: 10
    },
    buttonText: {
        color: '#E0E0E0', // Example text color
        fontSize: 12,
        fontWeight: 'bold',
    },

});