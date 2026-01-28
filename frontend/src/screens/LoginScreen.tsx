import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import { colors, typography, spacing, shadows } from '../theme';

export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Mock login logic
        if (username === 'admin') navigation.replace('AdminDashboard');
        else if (username === 'driver') navigation.replace('DriverDashboard');
        else if (username === 'customer') navigation.replace('OrderEntry');
        else alert('Invalid user');
    };

    return (
        <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1621905252472-a1e2dc8f11e4?w=1200' }}
            style={styles.background}
            blurRadius={2}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.overlay}>
                        <View style={styles.logoContainer}>
                            <Text style={styles.logo}>⚡</Text>
                            <Text style={styles.title}>Thunderbolt</Text>
                            <Text style={styles.subtitle}>Dispatch Management System</Text>
                        </View>

                        <View style={styles.formContainer}>
                            <Text style={styles.welcomeText}>Welcome Back</Text>
                            <Text style={styles.descriptionText}>
                                Sign in to access your dashboard
                            </Text>

                            <TextInput
                                placeholder="Username"
                                value={username}
                                onChangeText={setUsername}
                                autoCapitalize="none"
                                containerStyle={styles.inputContainer}
                            />

                            <TextInput
                                placeholder="Password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                containerStyle={styles.inputContainer}
                            />

                            <Button
                                title="Sign In"
                                onPress={handleLogin}
                                size="large"
                                style={styles.loginButton}
                            />

                            <View style={styles.infoContainer}>
                                <Text style={styles.infoText}>Demo Users:</Text>
                                <Text style={styles.infoDetail}>• admin / driver / customer</Text>
                            </View>
                        </View>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>
                                Built on Dedication. Driven by Experience.
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(30, 58, 95, 0.85)',
        justifyContent: 'space-between',
        paddingVertical: spacing.xxxl,
    },
    logoContainer: {
        alignItems: 'center',
        paddingTop: spacing.xl,
    },
    logo: {
        fontSize: 72,
        marginBottom: spacing.md,
    },
    title: {
        ...typography.h1,
        color: colors.textOnPrimary,
        fontWeight: '700',
        marginBottom: spacing.xs,
    },
    subtitle: {
        ...typography.body,
        color: colors.secondary,
        letterSpacing: 2,
        textTransform: 'uppercase',
        fontSize: 12,
    },
    formContainer: {
        backgroundColor: colors.surface,
        marginHorizontal: spacing.lg,
        padding: spacing.xl,
        borderRadius: 16,
        ...shadows.xl,
    },
    welcomeText: {
        ...typography.h2,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
        textAlign: 'center',
    },
    descriptionText: {
        ...typography.body,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    inputContainer: {
        marginBottom: spacing.md,
    },
    loginButton: {
        marginTop: spacing.lg,
    },
    infoContainer: {
        marginTop: spacing.lg,
        paddingTop: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.borderLight,
    },
    infoText: {
        ...typography.bodySmall,
        color: colors.textSecondary,
        fontWeight: '600',
        marginBottom: spacing.xs,
    },
    infoDetail: {
        ...typography.caption,
        color: colors.textLight,
    },
    footer: {
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
    },
    footerText: {
        ...typography.bodySmall,
        color: colors.textOnPrimary,
        textAlign: 'center',
        fontStyle: 'italic',
    },
});
