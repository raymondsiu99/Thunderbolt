import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { colors, typography, spacing, shadows, borderRadius } from '../theme';
import { adminAPI } from '../services/api';

interface Stats {
    totalJobs: number;
    activeDrivers: number;
    completedToday: number;
    monthlyRevenue: number;
}

interface Activity {
    id: number;
    action: string;
    details: string;
    timestamp: string;
    user?: {
        username: string;
    };
}

export default function AdminDashboard({ navigation }: any) {
    const [stats, setStats] = useState<Stats | null>(null);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const [statsData, activityData] = await Promise.all([
                adminAPI.getStats(),
                adminAPI.getActivityLogs(5),
            ]);
            setStats(statsData);
            setActivities(activityData);
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            Alert.alert('Error', 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return `$${(amount / 1000).toFixed(0)}K`;
    };

    const formatTimeAgo = (timestamp: string) => {
        const now = new Date();
        const then = new Date(timestamp);
        const diffMs = now.getTime() - then.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Loading dashboard...</Text>
            </View>
        );
    }

    const STATS = stats ? [
        { label: 'Total Jobs', value: stats.totalJobs.toString(), color: colors.primary, icon: '📋' },
        { label: 'Active Drivers', value: stats.activeDrivers.toString(), color: colors.secondary, icon: '🚛' },
        { label: 'Completed Today', value: stats.completedToday.toString(), color: colors.success, icon: '✅' },
        { label: 'Revenue (MTD)', value: formatCurrency(stats.monthlyRevenue), color: colors.accent, icon: '💰' },
    ] : [];

    const QUICK_ACTIONS = [
        { title: 'Create Job', icon: '➕', color: colors.primary, screen: 'OrderEntry' },
        { title: 'Manage Drivers', icon: '👥', color: colors.secondary, screen: 'ManageDrivers' },
        { title: 'View Reports', icon: '📊', color: colors.info, screen: 'Reports' },
        { title: 'Settings', icon: '⚙️', color: colors.textSecondary, screen: 'Settings' },
    ];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Welcome Back</Text>
                    <Text style={styles.adminName}>Admin Dashboard</Text>
                </View>
                <TouchableOpacity onPress={loadDashboardData}>
                    <Text style={styles.refreshButton}>🔄</Text>
                </TouchableOpacity>
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
                            onPress={() => {
                                if (action.screen && navigation) {
                                    navigation.navigate(action.screen);
                                } else {
                                    Alert.alert('Coming Soon', `${action.title} feature is under development`);
                                }
                            }}
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
                    <TouchableOpacity onPress={loadDashboardData}>
                        <Text style={styles.viewAllText}>Refresh →</Text>
                    </TouchableOpacity>
                </View>
                
                <View style={styles.activityContainer}>
                    {activities.length > 0 ? (
                        activities.map((activity) => (
                            <View key={activity.id} style={styles.activityItem}>
                                <View style={styles.activityIndicator} />
                                <View style={styles.activityContent}>
                                    <Text style={styles.activityAction}>{activity.action}</Text>
                                    <Text style={styles.activityDetails}>{activity.details}</Text>
                                    <Text style={styles.activityTime}>
                                        {formatTimeAgo(activity.timestamp)}
                                        {activity.user && ` • ${activity.user.username}`}
                                    </Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noDataText}>No recent activity</Text>
                    )}
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    loadingText: {
        ...typography.body,
        color: colors.textSecondary,
        marginTop: spacing.md,
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
    refreshButton: {
        fontSize: 24,
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
    noDataText: {
        ...typography.body,
        color: colors.textSecondary,
        textAlign: 'center',
        paddingVertical: spacing.lg,
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
