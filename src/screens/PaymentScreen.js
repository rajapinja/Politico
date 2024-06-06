import React, { useRef } from 'react';
import { View, TouchableOpacity, Animated, StyleSheet, Text } from 'react-native';

const PaymentScreen = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  const startAnimation = () => {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animatedStyles = {
    transform: [
      {
        scale: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.2],
        }),
      },
    ],
    opacity: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    }),
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={startAnimation}>
        <View style={styles.button}>        
              <Text style={styles.buttonText}>PAYMENT ANIMATION </Text>             
        </View>
      </TouchableOpacity>
      <Animated.View style={[styles.animation, animatedStyles]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  animation: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#00FF00', // Your medium green color
  },
  button: {
    height: 36, // Adjust the height as needed
    //backgroundColor: '#2196F3', // Example background color
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 13,
    width: 150,
    marginBottom: 16,    
    backgroundColor: '#007AFF'
  },
  buttonText: {
    color: '#E0E0E0', // Example text color
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;
