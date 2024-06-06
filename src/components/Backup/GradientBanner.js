import React from 'react';
import MultiColorText from './MulticolorText';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Ionicons for the hamburger icon


const GradientBanner = ({ text }) => {
  return (
    <LinearGradient     
      colors={['rgba(255, 126, 95, 0.5)', 'rgba(254, 180, 123, 0.5)', 'rgba(79, 172, 254, 0.5)']}      
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.gradientBackground}
    >     
       <Text style={styles.banner}>Score Recorder</Text>  
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    padding: 0,
    borderRadius: 10,
    marginVertical: 10,
    alignItems:'center', 
    width:'100%'
  },
  banner: {
    fontSize:22,
    marginTop: 5,   
    textShadowColor:"blue",
    fontWeight: 'bold', 
    color: '#32383D',   
       
  },
  hamburger: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default GradientBanner;
