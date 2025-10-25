import { StyleSheet } from "react-native";
import {
  buttonStyles,
  cardStyles,
  inputStyles,
  layoutStyles,
  textStyles,
} from "./common";
import { borderRadius, colors, spacing, typography } from "./theme";

export const registerScreenStyles = StyleSheet.create({
  container: {
    ...layoutStyles.container,
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing[6],
  },

  formContainer: {
    ...cardStyles.elevated,
    padding: spacing[8],
    marginHorizontal: spacing[2],
  },

  // Header styles
  header: {
    alignItems: "center",
    marginBottom: spacing[8],
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: spacing[4],
  },

  backButton: {
    padding: spacing[2],
    borderRadius: borderRadius.base,
    backgroundColor: colors.neutral[100],
  },

  backButtonText: {
    ...textStyles.body,
    color: colors.primary[500],
    fontWeight: typography.fontWeight.medium,
  },

  logo: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing[4],
    overflow: "hidden",
  },

  logoImage: {
    width: 300,
    height: 300,
  },

  languageSwitcher: {
    // Styles will be handled by the component
  },

  title: {
    ...textStyles.h1,
    textAlign: "center",
    marginBottom: spacing[2],
    color: colors.text.primary,
  },

  subtitle: {
    ...textStyles.bodySecondary,
    textAlign: "center",
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
    justifyContent: "center",
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

  // Password requirements
  passwordRequirements: {
    backgroundColor: colors.background.tertiary,
    padding: spacing[4],
    borderRadius: borderRadius.base,
    marginTop: spacing[2],
    borderLeftWidth: 4,
    borderLeftColor: colors.info,
  },

  passwordRequirementsTitle: {
    ...textStyles.caption,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },

  passwordRequirement: {
    ...textStyles.caption,
    color: colors.text.secondary,
    marginBottom: spacing[1],
  },

  passwordRequirementValid: {
    ...textStyles.caption,
    color: colors.success,
    marginBottom: spacing[1],
  },

  passwordRequirementInvalid: {
    ...textStyles.caption,
    color: colors.error,
    marginBottom: spacing[1],
  },

  // Error message
  errorContainer: {
    backgroundColor: colors.error + "10",
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

  // Terms and conditions
  termsContainer: {
    marginTop: spacing[4],
    padding: spacing[4],
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.base,
  },

  termsText: {
    ...textStyles.caption,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.sm,
  },

  termsLink: {
    ...textStyles.caption,
    color: colors.primary[500],
    fontWeight: typography.fontWeight.semibold,
  },

  // Checkbox styles
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: spacing[4],
    marginBottom: spacing[2],
  },

  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.primary[500],
    borderRadius: borderRadius.sm,
    marginRight: spacing[3],
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },

  checkboxChecked: {
    backgroundColor: colors.primary[500],
  },

  checkboxText: {
    ...textStyles.body,
    color: colors.text.primary,
    flex: 1,
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.base,
    paddingTop: 0,
    marginTop: -2,
  },

  checkboxDescription: {
    ...textStyles.caption,
    color: colors.text.secondary,
    marginTop: spacing[1],
    marginLeft: spacing[8],
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.sm,
  },
});
