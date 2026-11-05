import { StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from './theme';
import { cardStyles, textStyles, buttonStyles, inputStyles, layoutStyles } from './common';

export const productCreationStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  
  // Header styles — paddingTop comes from useSafeAreaPadding
  header: {
    backgroundColor: colors.primary[500],
    paddingTop: 0,
    paddingBottom: spacing[4],
    paddingHorizontal: spacing[4],
    borderBottomLeftRadius: borderRadius['2xl'],
    borderBottomRightRadius: borderRadius['2xl'],
    ...shadows.lg,
  },
  
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  
  headerTitle: {
    ...textStyles.h3,
    color: colors.text.inverse,
    flex: 1,
    flexShrink: 1,
    fontSize: typography.fontSize.xl,
    lineHeight: typography.fontSize.xl * typography.lineHeight.normal,
  },
  
  backButton: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderRadius: borderRadius.full,
    marginRight: spacing[2],
    flexShrink: 0,
  },
  
  backButtonText: {
    ...textStyles.button,
    color: colors.text.inverse,
    fontSize: typography.fontSize.base,
  },
  
  // Content styles
  content: {
    flex: 1,
    padding: spacing[4],
  },
  
  // Form container
  formContainer: {
    ...cardStyles.elevated,
    padding: spacing[4],
    marginBottom: spacing[4],
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
  
  // Status selection — icon above label so narrow screens don't break words
  statusSection: {
    marginBottom: spacing[6],
  },
  
  statusTitle: {
    ...textStyles.h4,
    color: colors.text.primary,
    marginBottom: spacing[3],
    fontSize: typography.fontSize.lg,
  },
  
  statusOptions: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: spacing[2],
  },
  
  statusOption: {
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[1],
    borderRadius: borderRadius.base,
    borderWidth: 2,
    borderColor: colors.neutral[300],
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
  },
  
  statusOptionSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  
  statusOptionIcon: {
    fontSize: typography.fontSize.lg,
    lineHeight: typography.fontSize.lg * 1.3,
    textAlign: 'center',
  },
  
  statusOptionText: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
    width: '100%',
  },
  
  statusOptionTextSelected: {
    color: colors.primary[700],
    fontWeight: typography.fontWeight.semibold,
  },
  
  
  // Action buttons — stacked full-width so long labels don't collapse on small screens
  actionButtons: {
    flexDirection: 'column',
    alignItems: 'stretch',
    width: '100%',
    marginTop: spacing[6],
    gap: spacing[3],
  },
  
  submitButton: {
    ...buttonStyles.primary,
    width: '100%',
    minHeight: 48,
    alignSelf: 'stretch',
  },
  
  submitButtonText: {
    ...buttonStyles.primaryText,
    textAlign: 'center',
    flexShrink: 1,
  },
  
  submitButtonDisabled: {
    ...buttonStyles.disabled,
    width: '100%',
    minHeight: 48,
    alignSelf: 'stretch',
  },
  
  submitButtonDisabledText: {
    ...buttonStyles.disabledText,
    textAlign: 'center',
  },
  
  cancelButton: {
    ...buttonStyles.secondary,
    width: '100%',
    minHeight: 48,
    alignSelf: 'stretch',
  },
  
  cancelButtonText: {
    ...buttonStyles.secondaryText,
    textAlign: 'center',
    flexShrink: 1,
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

  // Login required styles
  loginRequiredCard: {
    ...cardStyles.elevated,
    padding: spacing[6],
    alignItems: 'center',
    backgroundColor: colors.warning[50],
    borderWidth: 1,
    borderColor: colors.warning[200],
  },

  loginRequiredTitle: {
    ...textStyles.h3,
    color: colors.warning[700],
    marginBottom: spacing[3],
    textAlign: 'center',
  },

  loginRequiredDescription: {
    ...textStyles.body,
    color: colors.warning[600],
    textAlign: 'center',
    marginBottom: spacing[4],
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.base,
  },

  barcodeInfo: {
    ...textStyles.caption,
    color: colors.text.secondary,
    fontFamily: 'monospace',
    backgroundColor: colors.neutral[100],
    padding: spacing[2],
    borderRadius: borderRadius.base,
  },

  loginButton: {
    ...buttonStyles.primary,
    marginTop: spacing[4],
    alignSelf: 'center',
    minWidth: 120,
  },

  loginButtonText: {
    ...buttonStyles.primaryText,
    textAlign: 'center',
  },
});
