import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, shadows, borderRadius } from '../theme';

const STATS = [
    { label: 'Total Jobs', value: '1,234', color: colors.primary, icon: '📋' },
    { label: 'Active Drivers', value: '45', color: colors.secondary, icon: '🚛' },
    { label: 'Completed Today', value: '28', color: colors.success, icon: '✅' },
    { label: 'Revenue (MTD)', value: '$125K', color: colors.accent, icon: '💰' },
];

const QUICK_ACTIONS = [
    { title: 'Create Job', icon: '➕', color: colors.primary },
    { title: 'Manage Drivers', icon: '👥', color: colors.secondary },
    { title: 'View Reports', icon: '📊', color: colors.info },
    { title: 'Settings', icon: '⚙️', color: colors.textSecondary },
];

const RECENT_ACTIVITY = [
    { id: 1, action: 'New job created', details: 'Job #1234 - Site A', time: '5 min ago' },
    { id: 2, action: 'Job completed', details: 'Job #1233 by Driver John', time: '15 min ago' },
    { id: 3, action: 'Driver assigned', details: 'Driver Mike → Job #1235', time: '1 hour ago' },
    { id: 4, action: 'Payment received', details: 'Invoice #5678 - $2,500', time: '2 hours ago' },
];

export default function AdminDashboard() {
    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Welcome Back</Text>
                    <Text style={styles.adminName}>Admin Dashboard</Text>
                </View>
                <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</Text>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
                {STATS.map((stat, index) => (
                    <View key={index} style={[styles.statCard, { borderLeftColor: stat.color }]}>
                        <Text style={styles.statIcon}>{stat.icon}</Text>
                        <View style={styles.statContent}>
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </View>
                    </View>
                ))}
            </View>

            {/* Quick Actions */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionsGrid}>
                    {QUICK_ACTIONS.map((action, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.actionCard}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                                <Text style={styles.actionIconText}>{action.icon}</Text>
                            </View>
                            <Text style={styles.actionTitle}>{action.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Recent Activity */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Activity</Text>
                    <TouchableOpacity>
                        <Text style={styles.viewAllText}>View All →</Text>
                    </TouchableOpacity>
                </View>
                
                <View style={styles.activityContainer}>
                    {RECENT_ACTIVITY.map((activity) => (
                        <View key={activity.id} style={styles.activityItem}>
                            <View style={styles.activityIndicator} />
                            <View style={styles.activityContent}>
                                <Text style={styles.activityAction}>{activity.action}</Text>
                                <Text style={styles.activityDetails}>{activity.details}</Text>
                                <Text style={styles.activityTime}>{activity.time}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            {/* Info Section */}
            <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>⚡ Thunderbolt Dispatch</Text>
                <Text style={styles.infoText}>
                    Built on Dedication. Driven by Experience.
                </Text>
                <Text style={styles.infoSubtext}>
                    Manage your fleet, track jobs, and optimize operations all in one place.
                </Text>
            </View>

            <View style={{ height: spacing.xl }} />
        </ScrollView>
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
        paddingBottom: spacing.xl,
        borderBottomLeftRadius: borderRadius.xl,
        borderBottomRightRadius: borderRadius.xl,
        ...shadows.lg,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    greeting: {
        ...typography.body,
        color: colors.secondary,
        marginBottom: spacing.xs,
    },
    adminName: {
        ...typography.h2,
        color: colors.textOnPrimary,
        fontWeight: '700',
    },
    date: {
        ...typography.bodySmall,
        color: colors.textOnPrimary,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: spacing.lg,
        marginTop: spacing.lg,
        gap: spacing.md,
    },
    statCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        flex: 1,
        minWidth: '45%',
        flexDirection: 'row',
        alignItems: 'center',
        borderLeftWidth: 4,
        ...shadows.md,
    },
    statIcon: {
        fontSize: 32,
        marginRight: spacing.md,
    },
    statContent: {
        flex: 1,
    },
    statValue: {
        ...typography.h2,
        color: colors.textPrimary,
        fontWeight: '700',
    },
    statLabel: {
        ...typography.caption,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    section: {
        paddingHorizontal: spacing.lg,
        marginTop: spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    sectionTitle: {
        ...typography.h3,
        color: colors.textPrimary,
    },
    viewAllText: {
        ...typography.bodySmall,
        color: colors.primary,
        fontWeight: '600',
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
    },
    actionCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        flex: 1,
        minWidth: '45%',
        alignItems: 'center',
        ...shadows.sm,
    },
    actionIcon: {
        width: 56,
        height: 56,
        borderRadius: borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    actionIconText: {
        fontSize: 28,
    },
    actionTitle: {
        ...typography.bodySmall,
        color: colors.textPrimary,
        fontWeight: '600',
        textAlign: 'center',
    },
    activityContainer: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        ...shadows.sm,
    },
    activityItem: {
        flexDirection: 'row',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
    },
    activityIndicator: {
        width: 8,
        height: 8,
        borderRadius: borderRadius.full,
        backgroundColor: colors.secondary,
        marginTop: 6,
        marginRight: spacing.md,
    },
    activityContent: {
        flex: 1,
    },
    activityAction: {
        ...typography.body,
        color: colors.textPrimary,
        fontWeight: '600',
        marginBottom: spacing.xs,
    },
    activityDetails: {
        ...typography.bodySmall,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    activityTime: {
        ...typography.caption,
        color: colors.textLight,
    },
    infoSection: {
        marginHorizontal: spacing.lg,
        marginTop: spacing.xl,
        backgroundColor: colors.primaryLight,
        borderRadius: borderRadius.lg,
        padding: spacing.xl,
        ...shadows.md,
    },
    infoTitle: {
        ...typography.h3,
        color: colors.textOnPrimary,
        marginBottom: spacing.sm,
    },
    infoText: {
        ...typography.body,
        color: colors.secondary,
        fontStyle: 'italic',
        marginBottom: spacing.sm,
    },
    infoSubtext: {
        ...typography.bodySmall,
        color: colors.textOnPrimary,
        opacity: 0.9,
    },
});
