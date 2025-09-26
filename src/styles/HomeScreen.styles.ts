import { StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from './theme';
import { cardStyles, textStyles, buttonStyles, badgeStyles } from './common';

export const homeScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  
  // Header styles
  header: {
    backgroundColor: colors.primary[500],
    paddingTop: spacing[16],
    paddingBottom: spacing[8],
    paddingHorizontal: spacing[6],
    borderBottomLeftRadius: borderRadius['2xl'],
    borderBottomRightRadius: borderRadius['2xl'],
    position: "relative",
    ...shadows.lg,
  },
  
  headerContent: {
    alignItems: 'center',
    position: 'relative',
  },
  
  logoContainer: {
    width: 80,
    height: 80,
    marginBottom: spacing[4],
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  logoImage: {
    width: '100%',
    height: '100%',
  },
  
  burgerMenu: {
    position: 'absolute',
    top: 10,
    zIndex: 10,
  },
  
  title: {
    ...textStyles.h1,
    color: colors.text.inverse,
    marginBottom: spacing[2],
    textAlign: 'center',
  },
  
  subtitle: {
    ...textStyles.body,
    color: colors.text.inverse,
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: spacing[4],
  },
  
  adminBadge: {
    ...badgeStyles.halal,
    marginTop: spacing[2],
  },
  
  adminText: {
    ...badgeStyles.halalText,
  },
  
  logoutButton: {
    position: 'absolute',
    top: -spacing[2],
    right: 0,
    padding: spacing[3],
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: borderRadius.full,
    ...shadows.sm,
  },
  
  logoutText: {
    ...textStyles.button,
    color: colors.text.inverse,
    fontSize: typography.fontSize.sm,
  },
  
  // Content styles
  content: {
    flex: 1,
    padding: spacing[6],
  },
  
  sectionTitle: {
    ...textStyles.h3,
    marginBottom: spacing[6],
    color: colors.text.primary,
  },
  
  // Feature card styles
  featureCard: {
    ...cardStyles.elevated,
    marginBottom: spacing[5],
    borderLeftWidth: 4,
    borderLeftColor: colors.primary[500],
  },
  
  featureTitle: {
    ...textStyles.h4,
    marginBottom: spacing[2],
    color: colors.text.primary,
  },
  
  featureDescription: {
    ...textStyles.bodySecondary,
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.base,
  },
  
  // Admin section styles
  adminSection: {
    marginTop: spacing[8],
    paddingTop: spacing[6],
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  
  adminSectionTitle: {
    ...textStyles.h3,
    marginBottom: spacing[6],
    color: colors.text.primary,
  },
  
  // Welcome card
  welcomeCard: {
    ...cardStyles.base,
    marginBottom: spacing[6],
    backgroundColor: colors.primary[50],
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  
  welcomeTitle: {
    ...textStyles.h4,
    color: colors.primary[700],
    marginBottom: spacing[2],
  },
  
  welcomeDescription: {
    ...textStyles.bodySecondary,
    color: colors.primary[600],
  },
  
  // Quick actions
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[6],
  },
  
  quickActionButton: {
    ...buttonStyles.secondary,
    flex: 1,
    marginHorizontal: spacing[1],
  },
  
  quickActionText: {
    ...buttonStyles.secondaryText,
    textAlign: 'center',
  },
  
  // Stats cards
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[6],
  },
  
  statCard: {
    ...cardStyles.flat,
    flex: 1,
    marginHorizontal: spacing[1],
    alignItems: 'center',
    paddingVertical: spacing[4],
  },
  
  statNumber: {
    ...textStyles.h2,
    color: colors.primary[600],
    marginBottom: spacing[1],
  },
  
  statLabel: {
    ...textStyles.caption,
    textAlign: 'center',
  },

  // Auth card for non-authenticated users
  authCard: {
    ...cardStyles.elevated,
    marginTop: spacing[6],
    backgroundColor: colors.neutral[50],
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },

  authTitle: {
    ...textStyles.h4,
    color: colors.text.primary,
    marginBottom: spacing[2],
    textAlign: 'center',
  },

  authDescription: {
    ...textStyles.bodySecondary,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing[6],
  },

  authButton: {
    ...buttonStyles.primary,
    marginTop: spacing[4],
  },

  authButtonText: {
    ...buttonStyles.primaryText,
    textAlign: 'center',
  },
});
