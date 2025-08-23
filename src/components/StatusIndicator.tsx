import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import useIsStationary from '../customHooks/useIsStationary';
import Icon from 'react-native-vector-icons/Ionicons';
import { myColors } from '../theme/colors';

const StatusIndicator = () => {
    const isStationary = useIsStationary();

    return (
        <View style={styles.container}>
            <Text style={styles.labelText}>
                Device State:
            </Text>
            <View style={styles.row}>
                <Icon
                    name={isStationary ? 'location' : 'walk'}
                    size={28}
                    color={isStationary ? myColors.primary : myColors.secondary}
                />
                <Text
                    style={[
                        styles.statusText,
                        { color: isStationary ? myColors.primary : myColors.secondary }
                    ]}
                >
                    {isStationary ? 'Stationary' : 'Moving'}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    labelText: {
        color: myColors.primary,
        fontSize: 22,
        fontWeight: '600',
        marginRight: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    statusText: {
        fontSize: 22,
        fontWeight: '600',
    },
});

export default StatusIndicator;
