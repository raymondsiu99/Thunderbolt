import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function JobDetail({ route }) {
    const { job } = route.params;
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Job #{job.id}</Text>
            <Text>Location: {job.location}</Text>
            <Text>Status: {job.status}</Text>
            <View style={{ marginTop: 20 }}>
                <Button title="Update Status to En Route" onPress={() => alert('Updated!')} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, marginBottom: 10 },
});
