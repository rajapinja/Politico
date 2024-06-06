import React from 'react';
import { Text, StyleSheet, Image, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient from Expo


const GradientBanner = ({ text }) => {
    return (
        <LinearGradient
            colors={['rgba(255, 126, 95, 0.5)', 'rgba(254, 180, 123, 0.5)', 'rgba(79, 172, 254, 0.5)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientBackground}
        >

            <View style={styles.logoContainer}>
                <Image
                    source={require('../images/Logo_laraid.jpeg')}
                    style={styles.logo}
                    resizeMode="contain" // Adjust the resizeMode based on your logo's aspect ratio
                />
            </View>
            <Text style={styles.banner}>{text}</Text>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradientBackground: {
      paddingVertical: 10,
      paddingHorizontal: 10,
      width: '100%',
      flexDirection: 'row', // Align logo and text horizontally
      alignItems: 'center', // Center items vertically
      height: 60, // Set the height of the gradientBackground
      marginBottom:20
    },
    banner: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#32383D',
      marginLeft: 10, // Add spacing between logo and text
      //textShadowColor: 'blue',
      textAlign: 'center', // Center the text horizontally
      flex: 1, // Allow text to take remaining space
      marginRight:50,
      fontStyle: 'italic',
      textShadowColor: 'rgba(0, 0, 0, 0.6)', // Shadow color
      textShadowOffset: { width: 2, height: 2 }, // Shadow offset
      textShadowRadius: 6, // Shadow radius
    },
    logoContainer: {
    //   height: '100%', // Match the height of the gradientBackground
      width: 60, // Set a fixed width for the logo
      alignItems: 'flex-start', // Align logo to the left
      justifyContent: 'flex-start', // Align logo to the top
    },
    logo: {
      height: 59.8, // Make the logo fill its container's height
      aspectRatio: 1, // Maintain the aspect ratio of the logo
    },
  });
  

export default GradientBanner;
