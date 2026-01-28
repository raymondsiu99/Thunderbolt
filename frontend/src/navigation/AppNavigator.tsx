import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import DriverDashboard from '../screens/DriverDashboard';
import JobDetail from '../screens/JobDetail';
import AdminDashboard from '../screens/AdminDashboard';
import OrderEntry from '../screens/OrderEntry';
import ManageDrivers from '../screens/ManageDrivers';
import Reports from '../screens/Reports';
import Settings from '../screens/Settings';

const Stack = createStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="DriverDashboard" component={DriverDashboard} />
            <Stack.Screen name="JobDetail" component={JobDetail} />
            <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
            <Stack.Screen name="OrderEntry" component={OrderEntry} />
            <Stack.Screen name="ManageDrivers" component={ManageDrivers} />
            <Stack.Screen name="Reports" component={Reports} />
            <Stack.Screen name="Settings" component={Settings} />
        </Stack.Navigator>
    );
}
