import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSecurity } from '../context/SecurityProvider';
import useIsStationary from '../customHooks/useIsStationary';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../theme/colors';

const StatusIndicator = () => {
    const { theme } = useSecurity();
    const isStationary = useIsStationary();
    // const isStationary = true; // For testing purposes, always set to true
    const themeColors = colors[theme];

    return (
        <View style={[styles.container,
        { backgroundColor: themeColors.secondary, shadowColor: themeColors.primary }]}>
            <Icon
                name={!!isStationary ? 'location' : 'walk'}
                size={28}
                color={themeColors.primary}
                style={styles.icon}
            />
            <Text style={[styles.statusText, { color: themeColors.primary }]}>
                {isStationary ? 'Stationary' : 'Moving'}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 20,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        marginBottom: 20,
    },
    icon: {
        marginRight: 10,
    },
    statusText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default StatusIndicator;
