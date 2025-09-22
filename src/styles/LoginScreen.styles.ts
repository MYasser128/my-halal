import { StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from './theme';
import { cardStyles, textStyles, buttonStyles, inputStyles, layoutStyles } from './common';

export const loginScreenStyles = StyleSheet.create({
  container: {
    ...layoutStyles.container,
  },
  
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing[6],
  },
  
  formContainer: {
    ...cardStyles.elevated,
    padding: spacing[8],
    marginHorizontal: spacing[2],
  },
  
  // Header styles
  header: {
    alignItems: 'center',
    marginBottom: spacing[8],
  },
  
  logo: {
    width: 80,
    height: 80,
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.full,
    marginBottom: spacing[4],
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  
  logoText: {
    ...textStyles.h2,
    color: colors.text.inverse,
  },
  
  title: {
    ...textStyles.h1,
    textAlign: 'center',
    marginBottom: spacing[2],
    color: colors.text.primary,
  },
  
  subtitle: {
    ...textStyles.bodySecondary,
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  
  // Form styles
  form: {
    marginTop: spacing[2],
  },
  
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
  
  // Button styles
  button: {
    ...buttonStyles.primary,
    marginTop: spacing[4],
    marginBottom: spacing[6],
  },
  
  buttonText: {
    ...buttonStyles.primaryText,
  },
  
  buttonDisabled: {
    ...buttonStyles.disabled,
  },
  
  buttonDisabledText: {
    ...buttonStyles.disabledText,
  },
  
  // Switch container
  switchContainer: {
    ...layoutStyles.row,
    justifyContent: 'center',
    marginTop: spacing[4],
  },
  
  switchText: {
    ...textStyles.bodySecondary,
  },
  
  switchLink: {
    ...textStyles.body,
    color: colors.primary[500],
    fontWeight: typography.fontWeight.semibold,
  },
  
  // Divider
  divider: {
    ...layoutStyles.row,
    alignItems: 'center',
    marginVertical: spacing[6],
  },
  
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.neutral[300],
  },
  
  dividerText: {
    ...textStyles.caption,
    marginHorizontal: spacing[4],
    backgroundColor: colors.background.primary,
    paddingHorizontal: spacing[2],
  },
  
  // Social login buttons
  socialButton: {
    ...buttonStyles.secondary,
    marginBottom: spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  socialButtonText: {
    ...buttonStyles.secondaryText,
    marginLeft: spacing[2],
  },
  
  // Error message
  errorContainer: {
    backgroundColor: colors.error + '10',
    padding: spacing[3],
    borderRadius: borderRadius.base,
    marginBottom: spacing[4],
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  
  errorText: {
    ...textStyles.caption,
    color: colors.error,
    fontWeight: typography.fontWeight.medium,
  },
  
  // Loading indicator
  loadingContainer: {
    ...layoutStyles.center,
    padding: spacing[4],
  },
  
  loadingText: {
    ...textStyles.bodySecondary,
    marginTop: spacing[2],
  },
});
