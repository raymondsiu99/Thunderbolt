import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { colors, typography, spacing, shadows, borderRadius } from '../theme';

const MOCK_JOBS = [
    { id: '1', status: 'pending', location: 'Site A - Commercial Landscaping', customer: 'ABC Corp', time: '9:00 AM' },
    { id: '2', status: 'en_route', location: 'Site B - Topsoil Delivery', customer: 'XYZ Ltd', time: '11:30 AM' },
    { id: '3', status: 'pending', location: 'Site C - Maintenance Service', customer: 'Green Spaces Inc', time: '2:00 PM' },
];

const getStatusColor = (status: string) => {
    switch (status) {
        case 'pending': return colors.pending;
        case 'en_route': return colors.enRoute;
        case 'completed': return colors.completed;
        default: return colors.textSecondary;
    }
};

const getStatusLabel = (status: string) => {
    switch (status) {
        case 'pending': return 'Pending';
        case 'en_route': return 'En Route';
        case 'completed': return 'Completed';
        default: return status;
    }
};

export default function DriverDashboard({ navigation }: any) {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Good Morning</Text>
                    <Text style={styles.driverName}>Driver</Text>
                </View>
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>3</Text>
                        <Text style={styles.statLabel}>Jobs Today</Text>
                    </View>
                </View>
            </View>

            {/* Jobs List */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Today's Jobs</Text>
                    <View style={[styles.badge, { backgroundColor: colors.secondary }]}>
                        <Text style={styles.badgeText}>{MOCK_JOBS.length}</Text>
                    </View>
                </View>

                {MOCK_JOBS.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.jobCard}
                        onPress={() => navigation.navigate('JobDetail', { job: item })}
                        activeOpacity={0.7}
                    >
                        <View style={styles.jobHeader}>
                            <View style={styles.jobIdContainer}>
                                <Text style={styles.jobId}>Job #{item.id}</Text>
                                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                                    <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
                                </View>
                            </View>
                            <Text style={styles.jobTime}>{item.time}</Text>
                        </View>

                        <View style={styles.jobDetails}>
                            <View style={styles.jobRow}>
                                <Text style={styles.jobLabel}>📍 Location</Text>
                                <Text style={styles.jobValue}>{item.location}</Text>
                            </View>
                            <View style={styles.jobRow}>
                                <Text style={styles.jobLabel}>👤 Customer</Text>
                                <Text style={styles.jobValue}>{item.customer}</Text>
                            </View>
                        </View>

                        <View style={styles.cardFooter}>
                            <Text style={styles.viewDetailsText}>View Details →</Text>
                        </View>
                    </TouchableOpacity>
                ))}
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
        paddingBottom: spacing.xl,
        borderBottomLeftRadius: borderRadius.xl,
        borderBottomRightRadius: borderRadius.xl,
        ...shadows.lg,
    },
    greeting: {
        ...typography.body,
        color: colors.secondary,
        marginBottom: spacing.xs,
    },
    driverName: {
        ...typography.h2,
        color: colors.textOnPrimary,
        fontWeight: '700',
    },
    statsContainer: {
        flexDirection: 'row',
        marginTop: spacing.lg,
        gap: spacing.md,
    },
    statItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.md,
        alignItems: 'center',
    },
    statNumber: {
        ...typography.h2,
        color: colors.secondary,
        fontWeight: '700',
    },
    statLabel: {
        ...typography.caption,
        color: colors.textOnPrimary,
        marginTop: spacing.xs,
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: spacing.xl,
        marginBottom: spacing.md,
    },
    sectionTitle: {
        ...typography.h3,
        color: colors.textPrimary,
    },
    badge: {
        width: 28,
        height: 28,
        borderRadius: borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        ...typography.label,
        color: colors.textOnPrimary,
        fontSize: 12,
        fontWeight: '700',
    },
    jobCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.md,
        ...shadows.md,
    },
    jobHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.md,
    },
    jobIdContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    jobId: {
        ...typography.h4,
        color: colors.textPrimary,
        fontWeight: '600',
    },
    statusBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.sm,
    },
    statusText: {
        ...typography.caption,
        color: colors.textOnPrimary,
        fontWeight: '600',
        fontSize: 10,
        textTransform: 'uppercase',
    },
    jobTime: {
        ...typography.bodySmall,
        color: colors.textSecondary,
        fontWeight: '600',
    },
    jobDetails: {
        gap: spacing.sm,
    },
    jobRow: {
        flexDirection: 'column',
        gap: spacing.xs,
    },
    jobLabel: {
        ...typography.bodySmall,
        color: colors.textSecondary,
    },
    jobValue: {
        ...typography.body,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    cardFooter: {
        marginTop: spacing.md,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.borderLight,
    },
    viewDetailsText: {
        ...typography.bodySmall,
        color: colors.primary,
        fontWeight: '600',
    },
});
