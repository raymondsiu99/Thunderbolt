import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { colors, typography, spacing, shadows, borderRadius } from '../theme';
import { adminAPI } from '../services/api';

interface JobsReport {
    jobs: any[];
    summary: {
        total: number;
        byStatus: Record<string, number>;
    };
}

interface RevenueReport {
    period: string;
    totalRevenue: number;
    averagePerJob: number;
    jobsCompleted: number;
    revenueByPeriod: Record<string, number>;
}

export default function Reports({ navigation }: any) {
    const [activeTab, setActiveTab] = useState<'jobs' | 'drivers' | 'revenue'>('jobs');
    const [loading, setLoading] = useState(true);
    const [jobsReport, setJobsReport] = useState<JobsReport | null>(null);
    const [driversReport, setDriversReport] = useState<any[]>([]);
    const [revenueReport, setRevenueReport] = useState<RevenueReport | null>(null);
    const [revenuePeriod, setRevenuePeriod] = useState<'week' | 'month' | 'year'>('month');

    useEffect(() => {
        loadReports();
    }, [activeTab, revenuePeriod]);

    const loadReports = async () => {
        try {
            setLoading(true);
            if (activeTab === 'jobs') {
                const data = await adminAPI.getJobsReport();
                setJobsReport(data);
            } else if (activeTab === 'drivers') {
                const data = await adminAPI.getDriversReport();
                setDriversReport(data);
            } else if (activeTab === 'revenue') {
                const data = await adminAPI.getRevenueReport(revenuePeriod);
                setRevenueReport(data);
            }
        } catch (error) {
            console.error('Failed to load reports:', error);
            Alert.alert('Error', 'Failed to load reports');
        } finally {
            setLoading(false);
        }
    };

    const renderJobsReport = () => {
        if (!jobsReport) return null;

        return (
            <View>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>Jobs Summary</Text>
                    <Text style={styles.summaryValue}>{jobsReport.summary.total} Total Jobs</Text>
                    
                    <View style={styles.statusBreakdown}>
                        {Object.entries(jobsReport.summary.byStatus).map(([status, count]) => (
                            <View key={status} style={styles.statusItem}>
                                <Text style={styles.statusLabel}>{status}</Text>
                                <Text style={styles.statusCount}>{count}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Recent Jobs</Text>
                {jobsReport.jobs.slice(0, 10).map((job) => (
                    <View key={job.id} style={styles.jobCard}>
                        <View style={styles.jobHeader}>
                            <Text style={styles.jobId}>Job #{job.id}</Text>
                            <View style={[styles.statusBadge, getStatusStyle(job.status)]}>
                                <Text style={styles.statusBadgeText}>{job.status}</Text>
                            </View>
                        </View>
                        <Text style={styles.jobDetails}>
                            {job.truck_type} • {job.material || 'N/A'}
                        </Text>
                        {job.driver && (
                            <Text style={styles.jobDriver}>Driver: {job.driver.username}</Text>
                        )}
                    </View>
                ))}
            </View>
        );
    };

    const renderDriversReport = () => {
        if (!driversReport || driversReport.length === 0) return null;

        return (
            <View>
                <Text style={styles.sectionTitle}>Driver Performance</Text>
                {driversReport.map((driver) => (
                    <View key={driver.id} style={styles.driverCard}>
                        <Text style={styles.driverName}>{driver.username}</Text>
                        <Text style={styles.driverEmail}>{driver.email}</Text>
                        
                        {driver.stats && (
                            <View style={styles.driverStats}>
                                <View style={styles.driverStatItem}>
                                    <Text style={styles.driverStatValue}>{driver.stats.totalJobs}</Text>
                                    <Text style={styles.driverStatLabel}>Total</Text>
                                </View>
                                <View style={styles.driverStatItem}>
                                    <Text style={styles.driverStatValue}>{driver.stats.completedJobs}</Text>
                                    <Text style={styles.driverStatLabel}>Completed</Text>
                                </View>
                                <View style={styles.driverStatItem}>
                                    <Text style={styles.driverStatValue}>{driver.stats.activeJobs}</Text>
                                    <Text style={styles.driverStatLabel}>Active</Text>
                                </View>
                                <View style={styles.driverStatItem}>
                                    <Text style={[styles.driverStatValue, styles.completionRate]}>
                                        {driver.stats.completionRate}%
                                    </Text>
                                    <Text style={styles.driverStatLabel}>Rate</Text>
                                </View>
                            </View>
                        )}
                    </View>
                ))}
            </View>
        );
    };

    const renderRevenueReport = () => {
        if (!revenueReport) return null;

        return (
            <View>
                <View style={styles.periodSelector}>
                    {(['week', 'month', 'year'] as const).map((period) => (
                        <TouchableOpacity
                            key={period}
                            style={[
                                styles.periodButton,
                                revenuePeriod === period && styles.periodButtonActive,
                            ]}
                            onPress={() => setRevenuePeriod(period)}
                        >
                            <Text
                                style={[
                                    styles.periodButtonText,
                                    revenuePeriod === period && styles.periodButtonTextActive,
                                ]}
                            >
                                {period.charAt(0).toUpperCase() + period.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.revenueCard}>
                    <Text style={styles.revenueTitle}>Total Revenue</Text>
                    <Text style={styles.revenueAmount}>
                        ${revenueReport.totalRevenue.toLocaleString()}
                    </Text>
                    
                    <View style={styles.revenueStats}>
                        <View style={styles.revenueStatItem}>
                            <Text style={styles.revenueStatLabel}>Jobs Completed</Text>
                            <Text style={styles.revenueStatValue}>{revenueReport.jobsCompleted}</Text>
                        </View>
                        <View style={styles.revenueStatItem}>
                            <Text style={styles.revenueStatLabel}>Avg per Job</Text>
                            <Text style={styles.revenueStatValue}>
                                ${revenueReport.averagePerJob.toFixed(0)}
                            </Text>
                        </View>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Revenue by Day</Text>
                <View style={styles.chartContainer}>
                    {Object.entries(revenueReport.revenueByPeriod).map(([date, amount]) => (
                        <View key={date} style={styles.chartItem}>
                            <Text style={styles.chartDate}>{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
                            <Text style={styles.chartAmount}>${amount}</Text>
                        </View>
                    ))}
                </View>
            </View>
        );
    };

    const getStatusStyle = (status: string) => {
        const styles: Record<string, any> = {
            pending: { backgroundColor: colors.warning + '30', borderColor: colors.warning },
            dispatched: { backgroundColor: colors.info + '30', borderColor: colors.info },
            complete: { backgroundColor: colors.success + '30', borderColor: colors.success },
            cancelled: { backgroundColor: colors.error + '30', borderColor: colors.error },
        };
        return styles[status] || { backgroundColor: colors.borderLight, borderColor: colors.textSecondary };
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Loading reports...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Reports</Text>
                <View style={{ width: 60 }} />
            </View>

            <View style={styles.tabBar}>
                {(['jobs', 'drivers', 'revenue'] as const).map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.tabActive]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {activeTab === 'jobs' && renderJobsReport()}
                {activeTab === 'drivers' && renderDriversReport()}
                {activeTab === 'revenue' && renderRevenueReport()}
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
    tabBar: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        paddingHorizontal: spacing.lg,
        ...shadows.sm,
    },
    tab: {
        flex: 1,
        paddingVertical: spacing.md,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabActive: {
        borderBottomColor: colors.primary,
    },
    tabText: {
        ...typography.body,
        color: colors.textSecondary,
        fontWeight: '600',
    },
    tabTextActive: {
        color: colors.primary,
    },
    content: {
        flex: 1,
        padding: spacing.lg,
    },
    sectionTitle: {
        ...typography.h3,
        color: colors.textPrimary,
        marginTop: spacing.lg,
        marginBottom: spacing.md,
    },
    summaryCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.md,
        ...shadows.md,
    },
    summaryTitle: {
        ...typography.h3,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    summaryValue: {
        ...typography.h2,
        color: colors.primary,
        fontWeight: '700',
        marginBottom: spacing.md,
    },
    statusBreakdown: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    statusItem: {
        backgroundColor: colors.background,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
    },
    statusLabel: {
        ...typography.caption,
        color: colors.textSecondary,
    },
    statusCount: {
        ...typography.body,
        color: colors.textPrimary,
        fontWeight: '600',
    },
    jobCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.sm,
        ...shadows.sm,
    },
    jobHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    jobId: {
        ...typography.body,
        color: colors.textPrimary,
        fontWeight: '600',
    },
    statusBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: borderRadius.sm,
        borderWidth: 1,
    },
    statusBadgeText: {
        ...typography.caption,
        fontWeight: '600',
    },
    jobDetails: {
        ...typography.bodySmall,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    jobDriver: {
        ...typography.caption,
        color: colors.textLight,
    },
    driverCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.md,
        ...shadows.md,
    },
    driverName: {
        ...typography.h3,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    driverEmail: {
        ...typography.bodySmall,
        color: colors.textSecondary,
        marginBottom: spacing.md,
    },
    driverStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.borderLight,
    },
    driverStatItem: {
        alignItems: 'center',
    },
    driverStatValue: {
        ...typography.h3,
        color: colors.primary,
        fontWeight: '700',
    },
    completionRate: {
        color: colors.success,
    },
    driverStatLabel: {
        ...typography.caption,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    periodSelector: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },
    periodButton: {
        flex: 1,
        paddingVertical: spacing.sm,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.borderLight,
    },
    periodButtonActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    periodButtonText: {
        ...typography.body,
        color: colors.textSecondary,
        fontWeight: '600',
    },
    periodButtonTextActive: {
        color: colors.textOnPrimary,
    },
    revenueCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.xl,
        marginBottom: spacing.md,
        ...shadows.md,
        alignItems: 'center',
    },
    revenueTitle: {
        ...typography.body,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
    },
    revenueAmount: {
        ...typography.h1,
        color: colors.success,
        fontWeight: '700',
        marginBottom: spacing.lg,
    },
    revenueStats: {
        flexDirection: 'row',
        gap: spacing.xl,
    },
    revenueStatItem: {
        alignItems: 'center',
    },
    revenueStatLabel: {
        ...typography.caption,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    revenueStatValue: {
        ...typography.h3,
        color: colors.textPrimary,
        fontWeight: '600',
    },
    chartContainer: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        ...shadows.sm,
    },
    chartItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
    },
    chartDate: {
        ...typography.body,
        color: colors.textSecondary,
    },
    chartAmount: {
        ...typography.body,
        color: colors.success,
        fontWeight: '600',
    },
});
