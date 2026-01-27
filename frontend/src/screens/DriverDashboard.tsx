import React from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';

const MOCK_JOBS = [
    { id: '1', status: 'pending', location: 'Site A' },
    { id: '2', status: 'en_route', location: 'Site B' },
];

export default function DriverDashboard({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Driver Jobs</Text>
            <FlatList
                data={MOCK_JOBS}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.jobItem}>
                        <Text>{item.location} - {item.status}</Text>
                        <Button title="View" onPress={() => navigation.navigate('JobDetail', { job: item })} />
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 20, marginBottom: 20 },
    jobItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1 },
});
