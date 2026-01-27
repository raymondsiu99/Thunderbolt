import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function OrderEntry() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>New Order</Text>
            {/* Form would go here */}
            <Button title="Submit Order" onPress={() => alert('Submitted')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, marginBottom: 20 },
});
