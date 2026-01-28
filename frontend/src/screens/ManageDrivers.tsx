import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Modal, TextInput } from 'react-native';
import { colors, typography, spacing, shadows, borderRadius } from '../theme';
import { adminAPI } from '../services/api';
import Button from '../components/Button';

interface Driver {
    id: number;
    username: string;
    email: string;
    role: string;
    created_at: string;
    stats?: {
        totalJobs: number;
        completedJobs: number;
        activeJobs: number;
        completionRate: string;
    };
}

export default function ManageDrivers({ navigation }: any) {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'driver',
    });

    useEffect(() => {
        loadDrivers();
    }, []);

    const loadDrivers = async () => {
        try {
            setLoading(true);
            const data = await adminAPI.getDriversReport();
            setDrivers(data);
        } catch (error) {
            console.error('Failed to load drivers:', error);
            Alert.alert('Error', 'Failed to load drivers');
        } finally {
            setLoading(false);
        }
    };

    const handleAddDriver = () => {
        setEditingDriver(null);
        setFormData({ username: '', email: '', password: '', role: 'driver' });
        setModalVisible(true);
    };

    const handleEditDriver = (driver: Driver) => {
        setEditingDriver(driver);
        setFormData({
            username: driver.username,
            email: driver.email,
            password: '',
            role: driver.role,
        });
        setModalVisible(true);
    };

    const handleSaveDriver = async () => {
        try {
            if (!formData.username || !formData.email) {
                Alert.alert('Error', 'Please fill in all required fields');
                return;
            }

            if (!editingDriver && !formData.password) {
                Alert.alert('Error', 'Password is required for new drivers');
                return;
            }

            if (editingDriver) {
                await adminAPI.updateUser(editingDriver.id, formData);
                Alert.alert('Success', 'Driver updated successfully');
            } else {
                await adminAPI.createUser(formData);
                Alert.alert('Success', 'Driver created successfully');
            }

            setModalVisible(false);
            loadDrivers();
        } catch (error) {
            console.error('Failed to save driver:', error);
            Alert.alert('Error', 'Failed to save driver');
        }
    };

    const handleDeleteDriver = (driver: Driver) => {
        Alert.alert(
            'Confirm Delete',
            `Are you sure you want to delete ${driver.username}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await adminAPI.deleteUser(driver.id);
                            Alert.alert('Success', 'Driver deleted successfully');
                            loadDrivers();
                        } catch (error) {
                            console.error('Failed to delete driver:', error);
                            Alert.alert('Error', 'Failed to delete driver');
                        }
                    },
                },
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Loading drivers...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Manage Drivers</Text>
                <TouchableOpacity onPress={handleAddDriver} style={styles.addButton}>
                    <Text style={styles.addButtonText}>+ Add</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {drivers.map((driver) => (
                    <View key={driver.id} style={styles.driverCard}>
                        <View style={styles.driverHeader}>
                            <View style={styles.driverAvatar}>
                                <Text style={styles.driverAvatarText}>
                                    {driver.username.charAt(0).toUpperCase()}
                                </Text>
                            </View>
                            <View style={styles.driverInfo}>
                                <Text style={styles.driverName}>{driver.username}</Text>
                                <Text style={styles.driverEmail}>{driver.email}</Text>
                            </View>
                        </View>

                        {driver.stats && (
                            <View style={styles.statsContainer}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>{driver.stats.totalJobs}</Text>
                                    <Text style={styles.statLabel}>Total Jobs</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>{driver.stats.completedJobs}</Text>
                                    <Text style={styles.statLabel}>Completed</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>{driver.stats.activeJobs}</Text>
                                    <Text style={styles.statLabel}>Active</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>{driver.stats.completionRate}%</Text>
                                    <Text style={styles.statLabel}>Rate</Text>
                                </View>
                            </View>
                        )}

                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.editButton]}
                                onPress={() => handleEditDriver(driver)}
                            >
                                <Text style={styles.actionButtonText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.deleteButton]}
                                onPress={() => handleDeleteDriver(driver)}
                            >
                                <Text style={styles.actionButtonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Add/Edit Driver Modal */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {editingDriver ? 'Edit Driver' : 'Add New Driver'}
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Username"
                            value={formData.username}
                            onChangeText={(text) => setFormData({ ...formData, username: text })}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={formData.email}
                            onChangeText={(text) => setFormData({ ...formData, email: text })}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <TextInput
                            style={styles.input}
                            placeholder={editingDriver ? 'Password (leave blank to keep current)' : 'Password'}
                            value={formData.password}
                            onChangeText={(text) => setFormData({ ...formData, password: text })}
                            secureTextEntry
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={handleSaveDriver}
                            >
                                <Text style={[styles.modalButtonText, styles.saveButtonText]}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    addButton: {
        backgroundColor: colors.secondary,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
    },
    addButtonText: {
        ...typography.body,
        color: colors.textOnPrimary,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        padding: spacing.lg,
    },
    driverCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.md,
        ...shadows.md,
    },
    driverHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    driverAvatar: {
        width: 56,
        height: 56,
        borderRadius: borderRadius.full,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    driverAvatarText: {
        ...typography.h2,
        color: colors.textOnPrimary,
        fontWeight: '700',
    },
    driverInfo: {
        flex: 1,
    },
    driverName: {
        ...typography.h3,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    driverEmail: {
        ...typography.bodySmall,
        color: colors.textSecondary,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: spacing.md,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.borderLight,
        marginBottom: spacing.md,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        ...typography.h3,
        color: colors.primary,
        fontWeight: '700',
    },
    statLabel: {
        ...typography.caption,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    actionButton: {
        flex: 1,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
        alignItems: 'center',
    },
    editButton: {
        backgroundColor: colors.info,
    },
    deleteButton: {
        backgroundColor: colors.error,
    },
    actionButtonText: {
        ...typography.body,
        color: colors.textOnPrimary,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.xl,
        width: '90%',
        maxWidth: 400,
    },
    modalTitle: {
        ...typography.h2,
        color: colors.textPrimary,
        marginBottom: spacing.lg,
        textAlign: 'center',
    },
    input: {
        backgroundColor: colors.background,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.md,
        ...typography.body,
        color: colors.textPrimary,
        borderWidth: 1,
        borderColor: colors.borderLight,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginTop: spacing.md,
    },
    modalButton: {
        flex: 1,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: colors.borderLight,
    },
    saveButton: {
        backgroundColor: colors.primary,
    },
    modalButtonText: {
        ...typography.body,
        color: colors.textSecondary,
        fontWeight: '600',
    },
    saveButtonText: {
        color: colors.textOnPrimary,
    },
});
