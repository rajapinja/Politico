import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Use AsyncStorage for storing login time

const LoggedInTime = () => {
  const [loginTime, setLoginTime] = useState(null);

  useEffect(() => {
    // Retrieve login time from AsyncStorage
    const retrieveLoginTime = async () => {
      const storedLoginTime = await AsyncStorage.getItem('loginTime');
      if (storedLoginTime) {
        setLoginTime(new Date(parseInt(storedLoginTime, 10)));
      }
    };

    retrieveLoginTime();

    // Update login time every minute
    const interval = setInterval(() => {
      setLoginTime(new Date(loginTime));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [loginTime]);

  const currentTime = new Date();
  const loggedInDurationInSeconds = (currentTime - loginTime) / 1000;

  const hours = Math.floor(loggedInDurationInSeconds / 3600);
  const minutes = Math.floor((loggedInDurationInSeconds % 3600) / 60);

  return (
    <View>
      <Text style={styles.durationText}>
        Logged-In Time: {hours} h {minutes} m 
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  durationText: {
    color:'#9008cf',
    fontSize: 16,
  },
});

export default LoggedInTime;
