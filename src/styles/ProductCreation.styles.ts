import { StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from './theme';
import { cardStyles, textStyles, buttonStyles, inputStyles, layoutStyles } from './common';

export const productCreationStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  
  // Header styles
  header: {
    backgroundColor: colors.primary[500],
    paddingTop: spacing[12],
    paddingBottom: spacing[6],
    paddingHorizontal: spacing[6],
    borderBottomLeftRadius: borderRadius['2xl'],
    borderBottomRightRadius: borderRadius['2xl'],
    ...shadows.lg,
  },
  
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  headerTitle: {
    ...textStyles.h2,
    color: colors.text.inverse,
    flex: 1,
  },
  
  backButton: {
    padding: spacing[3],
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: borderRadius.full,
    marginRight: spacing[4],
  },
  
  backButtonText: {
    ...textStyles.button,
    color: colors.text.inverse,
    fontSize: typography.fontSize.base,
  },
  
  // Content styles
  content: {
    flex: 1,
    padding: spacing[6],
  },
  
  // Form container
  formContainer: {
    ...cardStyles.elevated,
    padding: spacing[6],
    marginBottom: spacing[6],
  },
  
  formTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginBottom: spacing[2],
    textAlign: 'center',
  },
  
  formSubtitle: {
    ...textStyles.bodySecondary,
    textAlign: 'center',
    marginBottom: spacing[4],
  },
  
  // Barcode display
  barcodeSection: {
    backgroundColor: colors.primary[50],
    padding: spacing[4],
    borderRadius: borderRadius.base,
    marginBottom: spacing[6],
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  
  barcodeLabel: {
    ...textStyles.caption,
    color: colors.primary[700],
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing[2],
  },
  
  barcodeValue: {
    ...textStyles.h4,
    color: colors.primary[800],
    fontFamily: 'monospace',
  },
  
  // Form fields
  inputContainer: {
    ...inputStyles.container,
  },
  
  label: {
    ...inputStyles.label,
  },
  
  input: {
    ...inputStyles.input,
  },
  
  inputFocused: {
    ...inputStyles.inputFocused,
  },
  
  inputError: {
    ...inputStyles.inputError,
  },
  
  errorText: {
    ...inputStyles.errorText,
  },
  
  // Text area for description
  textArea: {
    ...inputStyles.input,
    height: 100,
    textAlignVertical: 'top',
  },
  
  // Status selection
  statusSection: {
    marginBottom: spacing[6],
  },
  
  statusTitle: {
    ...textStyles.h4,
    color: colors.text.primary,
    marginBottom: spacing[4],
  },
  
  statusOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  statusOption: {
    flex: 1,
    marginHorizontal: spacing[1],
    padding: spacing[4],
    borderRadius: borderRadius.base,
    borderWidth: 2,
    borderColor: colors.neutral[300],
    alignItems: 'center',
  },
  
  statusOptionSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  
  statusOptionText: {
    ...textStyles.body,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
  
  statusOptionTextSelected: {
    color: colors.primary[700],
    fontWeight: typography.fontWeight.semibold,
  },
  
  // Country selection
  countrySection: {
    marginBottom: spacing[6],
  },
  
  countryTitle: {
    ...textStyles.h4,
    color: colors.text.primary,
    marginBottom: spacing[4],
  },
  
  countryOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  
  countryOption: {
    width: '48%',
    marginBottom: spacing[2],
    padding: spacing[3],
    borderRadius: borderRadius.base,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    alignItems: 'center',
  },
  
  countryOptionSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  
  countryOptionText: {
    ...textStyles.caption,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  
  countryOptionTextSelected: {
    color: colors.primary[700],
    fontWeight: typography.fontWeight.semibold,
  },
  
  // Action buttons
  actionButtons: {
    flexDirection: 'row',
    marginTop: spacing[6],
  },
  
  submitButton: {
    ...buttonStyles.primary,
    flex: 1,
    marginRight: spacing[2],
  },
  
  submitButtonText: {
    ...buttonStyles.primaryText,
  },
  
  submitButtonDisabled: {
    ...buttonStyles.disabled,
    flex: 1,
    marginRight: spacing[2],
  },
  
  submitButtonDisabledText: {
    ...buttonStyles.disabledText,
  },
  
  cancelButton: {
    ...buttonStyles.secondary,
    flex: 1,
    marginLeft: spacing[2],
  },
  
  cancelButtonText: {
    ...buttonStyles.secondaryText,
  },
  
  // Loading states
  loadingContainer: {
    ...layoutStyles.center,
    padding: spacing[4],
  },
  
  loadingText: {
    ...textStyles.bodySecondary,
    marginTop: spacing[2],
  },
  
  // Success message
  successContainer: {
    backgroundColor: colors.success + '10',
    padding: spacing[4],
    borderRadius: borderRadius.base,
    marginBottom: spacing[4],
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  
  successText: {
    ...textStyles.caption,
    color: colors.success,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
  },
  
  // Validation messages
  validationContainer: {
    backgroundColor: colors.warning + '10',
    padding: spacing[3],
    borderRadius: borderRadius.base,
    marginBottom: spacing[4],
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  
  validationText: {
    ...textStyles.caption,
    color: colors.warning,
    fontWeight: typography.fontWeight.medium,
  },
});
