import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RunningClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  return (
    <View >
      <Text style={styles.clockText}>
        {currentTime.toLocaleTimeString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clockText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RunningClock;
