import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Button from '../components/Button';
import { colors, typography, spacing, shadows, borderRadius } from '../theme';

const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending', color: colors.pending, icon: '⏳' },
    { value: 'en_route', label: 'En Route', color: colors.enRoute, icon: '🚛' },
    { value: 'in_progress', label: 'In Progress', color: colors.info, icon: '🔨' },
    { value: 'completed', label: 'Completed', color: colors.completed, icon: '✅' },
];

const getStatusInfo = (status: string) => {
    return STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0];
};

export default function JobDetail({ route }: any) {
    const { job } = route.params;
    const [currentStatus, setCurrentStatus] = useState(job.status);
    const statusInfo = getStatusInfo(currentStatus);

    const handleStatusUpdate = (newStatus: string) => {
        setCurrentStatus(newStatus);
        alert(`Status updated to ${getStatusInfo(newStatus).label}`);
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.jobId}>Job #{job.id}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
                        <Text style={styles.statusIcon}>{statusInfo.icon}</Text>
                        <Text style={styles.statusText}>{statusInfo.label}</Text>
                    </View>
                </View>
                {job.time && <Text style={styles.headerTime}>Scheduled: {job.time}</Text>}
            </View>

            {/* Job Information */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Job Information</Text>
                
                <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>📍 Location</Text>
                        <Text style={styles.infoValue}>{job.location}</Text>
                    </View>
                    
                    {job.customer && (
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>👤 Customer</Text>
                            <Text style={styles.infoValue}>{job.customer}</Text>
                        </View>
                    )}
                    
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>📅 Date</Text>
                        <Text style={styles.infoValue}>{new Date().toLocaleDateString()}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>🔧 Service Type</Text>
                        <Text style={styles.infoValue}>Commercial Landscaping</Text>
                    </View>
                </View>
            </View>

            {/* Status Update Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Update Job Status</Text>
                
                <View style={styles.statusGrid}>
                    {STATUS_OPTIONS.map((status) => (
                        <TouchableOpacity
                            key={status.value}
                            style={[
                                styles.statusOption,
                                currentStatus === status.value && styles.statusOptionActive,
                                { borderColor: status.color },
                            ]}
                            onPress={() => handleStatusUpdate(status.value)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.statusOptionIcon}>{status.icon}</Text>
                            <Text
                                style={[
                                    styles.statusOptionLabel,
                                    currentStatus === status.value && { color: status.color },
                                ]}
                            >
                                {status.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Job Notes */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Job Notes</Text>
                
                <View style={styles.notesCard}>
                    <Text style={styles.notesText}>
                        Standard commercial landscaping job. Equipment required: Excavator, Skid Steer. 
                        Estimated duration: 4-6 hours.
                    </Text>
                </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionSection}>
                <Button
                    title="📞 Call Customer"
                    onPress={() => alert('Calling customer...')}
                    variant="outline"
                    style={styles.actionButton}
                />
                
                <Button
                    title="🗺️ Get Directions"
                    onPress={() => alert('Opening maps...')}
                    variant="secondary"
                    style={styles.actionButton}
                />
                
                <Button
                    title="📝 Add Notes"
                    onPress={() => alert('Add notes feature...')}
                    variant="outline"
                    style={styles.actionButton}
                />
            </View>

            {/* Timeline */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Activity Timeline</Text>
                
                <View style={styles.timelineCard}>
                    <View style={styles.timelineItem}>
                        <View style={[styles.timelineDot, { backgroundColor: colors.completed }]} />
                        <View style={styles.timelineContent}>
                            <Text style={styles.timelineTitle}>Job Created</Text>
                            <Text style={styles.timelineTime}>Today at 8:00 AM</Text>
                        </View>
                    </View>
                    
                    <View style={styles.timelineItem}>
                        <View style={[styles.timelineDot, { backgroundColor: colors.info }]} />
                        <View style={styles.timelineContent}>
                            <Text style={styles.timelineTitle}>Driver Assigned</Text>
                            <Text style={styles.timelineTime}>Today at 8:15 AM</Text>
                        </View>
                    </View>
                    
                    <View style={styles.timelineItem}>
                        <View style={[styles.timelineDot, { backgroundColor: colors.textLight }]} />
                        <View style={styles.timelineContent}>
                            <Text style={styles.timelineTitle}>Status: {statusInfo.label}</Text>
                            <Text style={styles.timelineTime}>Current</Text>
                        </View>
                    </View>
                </View>
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
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    jobId: {
        ...typography.h2,
        color: colors.textOnPrimary,
        fontWeight: '700',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        gap: spacing.xs,
    },
    statusIcon: {
        fontSize: 16,
    },
    statusText: {
        ...typography.bodySmall,
        color: colors.textOnPrimary,
        fontWeight: '600',
    },
    headerTime: {
        ...typography.bodySmall,
        color: colors.secondary,
    },
    section: {
        paddingHorizontal: spacing.lg,
        marginTop: spacing.xl,
    },
    sectionTitle: {
        ...typography.h3,
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    infoCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        ...shadows.md,
    },
    infoRow: {
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
    },
    infoLabel: {
        ...typography.bodySmall,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    infoValue: {
        ...typography.body,
        color: colors.textPrimary,
        fontWeight: '600',
    },
    statusGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
    },
    statusOption: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        flex: 1,
        minWidth: '45%',
        alignItems: 'center',
        borderWidth: 2,
        ...shadows.sm,
    },
    statusOptionActive: {
        backgroundColor: colors.surface,
        ...shadows.lg,
    },
    statusOptionIcon: {
        fontSize: 32,
        marginBottom: spacing.sm,
    },
    statusOptionLabel: {
        ...typography.bodySmall,
        color: colors.textSecondary,
        fontWeight: '600',
    },
    notesCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        ...shadows.sm,
    },
    notesText: {
        ...typography.body,
        color: colors.textSecondary,
        lineHeight: 24,
    },
    actionSection: {
        paddingHorizontal: spacing.lg,
        marginTop: spacing.xl,
        gap: spacing.md,
    },
    actionButton: {
        marginBottom: 0,
    },
    timelineCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        ...shadows.sm,
    },
    timelineItem: {
        flexDirection: 'row',
        paddingVertical: spacing.md,
        borderLeftWidth: 2,
        borderLeftColor: colors.borderLight,
        paddingLeft: spacing.lg,
        marginLeft: spacing.sm,
    },
    timelineDot: {
        width: 12,
        height: 12,
        borderRadius: borderRadius.full,
        position: 'absolute',
        left: -7,
        top: spacing.md + 4,
    },
    timelineContent: {
        flex: 1,
    },
    timelineTitle: {
        ...typography.body,
        color: colors.textPrimary,
        fontWeight: '600',
        marginBottom: spacing.xs,
    },
    timelineTime: {
        ...typography.caption,
        color: colors.textLight,
    },
});
