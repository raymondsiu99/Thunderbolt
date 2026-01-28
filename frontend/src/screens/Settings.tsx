import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { colors, typography, spacing, shadows, borderRadius } from '../theme';

export default function Settings({ navigation }: any) {
    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: () => {
                        // Clear auth token
                        localStorage.removeItem('authToken');
                        // Navigate to login
                        if (navigation) {
                            navigation.navigate('Login');
                        }
                    },
                },
            ]
        );
    };

    const settingsOptions = [
        {
            title: 'Account',
            items: [
                { label: 'Profile Settings', icon: '👤', action: () => Alert.alert('Coming Soon', 'Profile settings feature') },
                { label: 'Change Password', icon: '🔒', action: () => Alert.alert('Coming Soon', 'Change password feature') },
                { label: 'Notifications', icon: '🔔', action: () => Alert.alert('Coming Soon', 'Notification settings feature') },
            ],
        },
        {
            title: 'System',
            items: [
                { label: 'Database Connection', icon: '🗄️', action: () => Alert.alert('Coming Soon', 'Database configuration feature') },
                { label: 'API Configuration', icon: '⚙️', action: () => Alert.alert('Coming Soon', 'API settings feature') },
                { label: 'Backup & Restore', icon: '💾', action: () => Alert.alert('Coming Soon', 'Backup feature') },
            ],
        },
        {
            title: 'Application',
            items: [
                { label: 'About', icon: 'ℹ️', action: () => Alert.alert('Thunderbolt Dispatch', 'Version 1.0.0\n\nBuilt on Dedication. Driven by Experience.') },
                { label: 'Help & Support', icon: '❓', action: () => Alert.alert('Coming Soon', 'Help & support feature') },
                { label: 'Terms of Service', icon: '📄', action: () => Alert.alert('Coming Soon', 'Terms of service') },
            ],
        },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={{ width: 60 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {settingsOptions.map((section, sectionIndex) => (
                    <View key={sectionIndex} style={styles.section}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <View style={styles.sectionContent}>
                            {section.items.map((item, itemIndex) => (
                                <TouchableOpacity
                                    key={itemIndex}
                                    style={[
                                        styles.settingItem,
                                        itemIndex === section.items.length - 1 && styles.settingItemLast,
                                    ]}
                                    onPress={item.action}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.settingIcon}>{item.icon}</Text>
                                    <Text style={styles.settingLabel}>{item.label}</Text>
                                    <Text style={styles.settingArrow}>›</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ))}

                {/* Logout Button */}
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                    activeOpacity={0.7}
                >
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

                {/* App Info */}
                <View style={styles.appInfo}>
                    <Text style={styles.appInfoTitle}>⚡ Thunderbolt Dispatch OS</Text>
                    <Text style={styles.appInfoText}>Version 1.0.0</Text>
                    <Text style={styles.appInfoSubtext}>
                        Built on Dedication. Driven by Experience.
                    </Text>
                </View>

                <View style={{ height: spacing.xl }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        backgroundColor: colors.primary,
        paddingTop: spacing.xxl,
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.lg,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...shadows.md,
    },
    backButton: {
        padding: spacing.sm,
    },
    backText: {
        ...typography.body,
        color: colors.textOnPrimary,
        fontWeight: '600',
    },
    headerTitle: {
        ...typography.h2,
        color: colors.textOnPrimary,
        fontWeight: '700',
    },
    content: {
        flex: 1,
        padding: spacing.lg,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        ...typography.caption,
        color: colors.textSecondary,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: spacing.sm,
        paddingHorizontal: spacing.sm,
    },
    sectionContent: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        ...shadows.sm,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
    },
    settingItemLast: {
        borderBottomWidth: 0,
    },
    settingIcon: {
        fontSize: 24,
        marginRight: spacing.md,
    },
    settingLabel: {
        ...typography.body,
        color: colors.textPrimary,
        flex: 1,
    },
    settingArrow: {
        ...typography.h2,
        color: colors.textLight,
    },
    logoutButton: {
        backgroundColor: colors.error,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        alignItems: 'center',
        marginTop: spacing.lg,
        ...shadows.md,
    },
    logoutText: {
        ...typography.body,
        color: colors.textOnPrimary,
        fontWeight: '700',
    },
    appInfo: {
        alignItems: 'center',
        marginTop: spacing.xxl,
        padding: spacing.lg,
    },
    appInfoTitle: {
        ...typography.h3,
        color: colors.primary,
        marginBottom: spacing.xs,
    },
    appInfoText: {
        ...typography.bodySmall,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
    },
    appInfoSubtext: {
        ...typography.caption,
        color: colors.textLight,
        fontStyle: 'italic',
        textAlign: 'center',
    },
});
