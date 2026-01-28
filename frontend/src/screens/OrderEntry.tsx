import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import { colors, typography, spacing, shadows, borderRadius } from '../theme';

const SERVICE_TYPES = [
    { id: 'commercial', name: 'Commercial Landscaping', icon: '🏢' },
    { id: 'civil', name: 'Civil Construction', icon: '🏗️' },
    { id: 'maintenance', name: 'Maintenance Service', icon: '🔧' },
    { id: 'topsoil', name: 'Topsoil & Trucking', icon: '🚛' },
    { id: 'residential', name: 'Residential', icon: '🏡' },
];

export default function OrderEntry() {
    const [selectedService, setSelectedService] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [contactPhone, setContactPhone] = useState('');

    const handleSubmit = () => {
        if (!selectedService || !customerName || !location) {
            alert('Please fill in all required fields');
            return;
        }
        alert('Order submitted successfully!');
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>New Order Request</Text>
                <Text style={styles.subtitle}>Let Us Guide You Through Your Next Project</Text>
            </View>

            {/* Form Container */}
            <View style={styles.formContainer}>
                {/* Service Selection */}
                <View style={styles.formSection}>
                    <Text style={styles.sectionTitle}>Select Service Type *</Text>
                    <View style={styles.servicesGrid}>
                        {SERVICE_TYPES.map((service) => (
                            <View
                                key={service.id}
                                style={[
                                    styles.serviceCard,
                                    selectedService === service.id && styles.serviceCardSelected,
                                ]}
                                onTouchEnd={() => setSelectedService(service.id)}
                            >
                                <Text style={styles.serviceIcon}>{service.icon}</Text>
                                <Text
                                    style={[
                                        styles.serviceName,
                                        selectedService === service.id && styles.serviceNameSelected,
                                    ]}
                                >
                                    {service.name}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Customer Information */}
                <View style={styles.formSection}>
                    <Text style={styles.sectionTitle}>Customer Information</Text>
                    
                    <TextInput
                        label="Customer Name *"
                        placeholder="Enter customer or company name"
                        value={customerName}
                        onChangeText={setCustomerName}
                    />

                    <TextInput
                        label="Contact Phone *"
                        placeholder="(555) 123-4567"
                        value={contactPhone}
                        onChangeText={setContactPhone}
                        keyboardType="phone-pad"
                    />
                </View>

                {/* Job Details */}
                <View style={styles.formSection}>
                    <Text style={styles.sectionTitle}>Job Details</Text>
                    
                    <TextInput
                        label="Location / Site Address *"
                        placeholder="Enter job site location"
                        value={location}
                        onChangeText={setLocation}
                        multiline
                    />

                    <TextInput
                        label="Project Description"
                        placeholder="Describe the work to be done..."
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                        style={styles.textArea}
                    />
                </View>

                {/* Info Box */}
                <View style={styles.infoBox}>
                    <Text style={styles.infoIcon}>ℹ️</Text>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoTitle}>What Happens Next?</Text>
                        <Text style={styles.infoText}>
                            Our team will review your request and contact you within 24 hours to discuss details and provide a quote.
                        </Text>
                    </View>
                </View>

                {/* Submit Button */}
                <Button
                    title="Submit Order Request"
                    onPress={handleSubmit}
                    size="large"
                    style={styles.submitButton}
                />

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Questions? Call us at <Text style={styles.phoneLink}>(555) 123-4567</Text>
                    </Text>
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
    title: {
        ...typography.h2,
        color: colors.textOnPrimary,
        fontWeight: '700',
        marginBottom: spacing.xs,
    },
    subtitle: {
        ...typography.body,
        color: colors.secondary,
        opacity: 0.9,
    },
    formContainer: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
    },
    formSection: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        ...typography.h4,
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    servicesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
    },
    serviceCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        flex: 1,
        minWidth: '45%',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.border,
        ...shadows.sm,
    },
    serviceCardSelected: {
        borderColor: colors.secondary,
        backgroundColor: colors.secondary + '10',
    },
    serviceIcon: {
        fontSize: 36,
        marginBottom: spacing.sm,
    },
    serviceName: {
        ...typography.bodySmall,
        color: colors.textPrimary,
        textAlign: 'center',
        fontWeight: '500',
    },
    serviceNameSelected: {
        color: colors.secondary,
        fontWeight: '700',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    infoBox: {
        backgroundColor: colors.info + '15',
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        flexDirection: 'row',
        marginBottom: spacing.xl,
        borderLeftWidth: 4,
        borderLeftColor: colors.info,
    },
    infoIcon: {
        fontSize: 24,
        marginRight: spacing.md,
    },
    infoContent: {
        flex: 1,
    },
    infoTitle: {
        ...typography.body,
        color: colors.textPrimary,
        fontWeight: '600',
        marginBottom: spacing.xs,
    },
    infoText: {
        ...typography.bodySmall,
        color: colors.textSecondary,
        lineHeight: 20,
    },
    submitButton: {
        marginBottom: spacing.lg,
    },
    footer: {
        alignItems: 'center',
        paddingVertical: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.borderLight,
    },
    footerText: {
        ...typography.bodySmall,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    phoneLink: {
        color: colors.primary,
        fontWeight: '600',
    },
});
