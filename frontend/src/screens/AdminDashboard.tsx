import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AdminDashboard() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Admin Dashboard</Text>
            <Text>Manage users, jobs, and assets here.</Text>
            {/* Add Dashboard Charts and Links here */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, marginBottom: 20 },
});
