import { StyleSheet } from "react-native";
import {
  buttonStyles,
  cardStyles,
  inputStyles,
  layoutStyles,
  textStyles,
} from "./common";
import { borderRadius, colors, spacing, typography } from "./theme";

export const loginScreenStyles = StyleSheet.create({
  container: {
    ...layoutStyles.container,
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
  },

  formContainer: {
    ...cardStyles.elevated,
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
    padding: spacing[5],
    overflow: "hidden",
  },

  // Header styles
  header: {
    alignItems: "center",
    marginBottom: spacing[5],
    width: "100%",
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: spacing[4],
    gap: spacing[2],
  },

  backButton: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderRadius: borderRadius.base,
    backgroundColor: colors.neutral[100],
    flexShrink: 1,
  },

  backButtonText: {
    ...textStyles.body,
    color: colors.primary[500],
    fontWeight: typography.fontWeight.medium,
  },

  logo: {
    width: 110,
    height: 110,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing[3],
    overflow: "hidden",
  },

  logoImage: {
    width: 110,
    height: 110,
  },

  languageSwitcher: {
    // Styles will be handled by the component
  },

  title: {
    ...textStyles.h2,
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

  // Password input with toggle
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderRadius: borderRadius.base,
    backgroundColor: colors.background.primary,
    paddingRight: spacing[1],
  },

  passwordInput: {
    flex: 1,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    minWidth: 0,
  },

  passwordToggle: {
    padding: spacing[2],
  },

  passwordToggleText: {
    fontSize: 18,
    color: colors.text.secondary,
  },

  inputFocused: {
    ...inputStyles.inputFocused,
  },

  // Button styles
  button: {
    ...buttonStyles.primary,
    width: "100%",
    minHeight: 48,
    paddingHorizontal: spacing[4],
    marginTop: spacing[4],
    marginBottom: spacing[4],
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
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing[2],
    width: "100%",
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
    alignItems: "center",
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  socialButtonText: {
    ...buttonStyles.secondaryText,
    marginLeft: spacing[2],
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    ...buttonStyles.primaryText,
    marginLeft: spacing[2],
  },
});
