import { StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from './theme';
import { cardStyles, textStyles, buttonStyles, badgeStyles, layoutStyles } from './common';

export const adminPanelStyles = StyleSheet.create({
  // Button styles for navigation
  adminButton: {
    ...buttonStyles.secondary,
    marginTop: spacing[4],
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  
  adminButtonText: {
    ...buttonStyles.secondaryText,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  
  adminButtonIcon: {
    marginRight: spacing[2],
  },
  
  // Full screen styles
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
  
  // Tab styles
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background.primary,
    marginHorizontal: spacing[6],
    marginTop: spacing[6],
    borderRadius: borderRadius.lg,
    padding: spacing[1],
    ...shadows.sm,
  },
  
  tab: {
    flex: 1,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  
  activeTab: {
    backgroundColor: colors.primary[500],
    ...shadows.sm,
  },
  
  tabText: {
    ...textStyles.body,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
  
  activeTabText: {
    color: colors.text.inverse,
    fontWeight: typography.fontWeight.semibold,
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
  
  // Loading styles
  loadingContainer: {
    ...layoutStyles.center,
    padding: spacing[8],
  },
  
  loadingText: {
    ...textStyles.bodySecondary,
    marginTop: spacing[4],
  },
  
  // Empty state
  emptyContainer: {
    ...layoutStyles.center,
    padding: spacing[8],
  },
  
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing[4],
  },
  
  emptyTitle: {
    ...textStyles.h4,
    color: colors.text.secondary,
    marginBottom: spacing[2],
    textAlign: 'center',
  },
  
  emptyText: {
    ...textStyles.bodySecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.base,
  },
  
  // Report card styles
  reportCard: {
    ...cardStyles.elevated,
    marginBottom: spacing[4],
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[3],
  },
  
  reportTitle: {
    ...textStyles.h4,
    color: colors.text.primary,
    flex: 1,
    marginRight: spacing[2],
  },
  
  reportStatusBadge: {
    ...badgeStyles.pending,
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[2],
  },
  
  reportStatusText: {
    ...badgeStyles.pendingText,
    fontSize: typography.fontSize.xs,
  },
  
  reportDetails: {
    marginBottom: spacing[4],
  },
  
  reportDetailRow: {
    flexDirection: 'row',
    marginBottom: spacing[1],
  },
  
  reportDetailLabel: {
    ...textStyles.caption,
    color: colors.text.tertiary,
    fontWeight: typography.fontWeight.semibold,
    width: 80,
  },
  
  reportDetailValue: {
    ...textStyles.caption,
    color: colors.text.secondary,
    flex: 1,
  },
  
  reportNotes: {
    ...textStyles.caption,
    color: colors.text.secondary,
    fontStyle: 'italic',
    backgroundColor: colors.background.tertiary,
    padding: spacing[2],
    borderRadius: borderRadius.sm,
    marginTop: spacing[2],
  },
  
  // Action buttons
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing[3],
  },
  
  approveButton: {
    ...buttonStyles.primary,
    flex: 1,
    marginRight: spacing[2],
    backgroundColor: colors.success,
  },
  
  approveButtonText: {
    ...buttonStyles.primaryText,
  },
  
  rejectButton: {
    ...buttonStyles.primary,
    flex: 1,
    marginLeft: spacing[2],
    backgroundColor: colors.error,
  },
  
  rejectButtonText: {
    ...buttonStyles.primaryText,
  },
  
  // User card styles
  userCard: {
    ...cardStyles.elevated,
    marginBottom: spacing[4],
  },
  
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  
  userEmail: {
    ...textStyles.h4,
    color: colors.text.primary,
    flex: 1,
  },
  
  adminBadge: {
    ...badgeStyles.halal,
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[2],
  },
  
  adminBadgeText: {
    ...badgeStyles.halalText,
    fontSize: typography.fontSize.xs,
  },
  
  userStatus: {
    ...textStyles.bodySecondary,
    marginBottom: spacing[3],
  },
  
  // User action buttons
  userActionButton: {
    ...buttonStyles.secondary,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
  },
  
  userActionButtonText: {
    ...buttonStyles.secondaryText,
  },
  
  grantAdminButton: {
    ...buttonStyles.primary,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    backgroundColor: colors.primary[500],
  },
  
  grantAdminButtonText: {
    ...buttonStyles.primaryText,
  },
  
  revokeAdminButton: {
    ...buttonStyles.primary,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    backgroundColor: colors.warning,
  },
  
  revokeAdminButtonText: {
    ...buttonStyles.primaryText,
  },
  
  // Stats cards
  statsContainer: {
    flexDirection: 'row',
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
    color: colors.text.secondary,
  },
  
  // Error states
  errorContainer: {
    backgroundColor: colors.error + '10',
    padding: spacing[4],
    borderRadius: borderRadius.base,
    marginBottom: spacing[4],
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  
  errorText: {
    ...textStyles.caption,
    color: colors.error,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
  },
});
