import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSecurity } from '../context/SecurityContext';

const LogsDisplay = () => {
  const { theme } = useSecurity();
  const isDark = theme === 'dark';
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const loadLogs = async () => {
      const storedLogs = await AsyncStorage.getItem('securityLogs');
      if (storedLogs) {
        setLogs(JSON.parse(storedLogs));
      }
    };

    loadLogs();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#000' }]}>Recent Logs</Text>
      {logs.length === 0 ? (
        <Text style={[styles.noLogs, { color: isDark ? '#BBBBBB' : '#777' }]}>No recent messages</Text>
      ) : (
        <FlatList
          data={logs.reverse()} // Show latest first
          renderItem={({ item }) => <Text style={[styles.logItem, { color: isDark ? '#FFF' : '#000' }]}>{item}</Text>}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noLogs: {
    fontSize: 16,
    marginTop: 10,
  },
  logItem: {
    fontSize: 14,
    paddingVertical: 5,
  },
});

export default LogsDisplay;
