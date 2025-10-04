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

  // Product management styles
  searchContainer: {
    marginBottom: spacing[6],
  },

  searchInput: {
    ...textStyles.body,
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.border.primary,
    borderRadius: borderRadius.base,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    color: colors.text.primary,
  },

  productCard: {
    ...cardStyles.elevated,
    marginBottom: spacing[4],
  },

  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[3],
  },

  productName: {
    ...textStyles.h4,
    color: colors.text.primary,
    flex: 1,
    marginRight: spacing[2],
  },

  statusBadge: {
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[2],
    borderRadius: borderRadius.sm,
  },

  halalBadge: {
    backgroundColor: colors.success + '20',
    borderWidth: 1,
    borderColor: colors.success,
  },

  haramBadge: {
    backgroundColor: colors.error + '20',
    borderWidth: 1,
    borderColor: colors.error,
  },

  suspiciousBadge: {
    backgroundColor: colors.suspicious + '20',
    borderWidth: 1,
    borderColor: colors.suspicious,
  },

  unknownBadge: {
    backgroundColor: colors.warning + '20',
    borderWidth: 1,
    borderColor: colors.warning,
  },

  statusText: {
    ...textStyles.caption,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },

  halalText: {
    color: colors.success,
  },

  haramText: {
    color: colors.error,
  },

  suspiciousText: {
    color: colors.suspicious,
  },

  unknownText: {
    color: colors.warning,
  },

  productDetails: {
    marginBottom: spacing[4],
  },

  productDetailRow: {
    flexDirection: 'row',
    marginBottom: spacing[1],
  },

  productDetailLabel: {
    ...textStyles.caption,
    color: colors.text.tertiary,
    fontWeight: typography.fontWeight.semibold,
    width: 100,
  },

  productDetailValue: {
    ...textStyles.caption,
    color: colors.text.secondary,
    flex: 1,
  },

  productActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  editButton: {
    ...buttonStyles.secondary,
    flex: 1,
    marginRight: spacing[2],
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[300],
  },

  editButtonText: {
    ...buttonStyles.secondaryText,
    color: colors.primary[600],
  },

  deleteButton: {
    ...buttonStyles.secondary,
    flex: 1,
    marginLeft: spacing[2],
    backgroundColor: colors.error + '10',
    borderColor: colors.error + '30',
  },

  deleteButtonText: {
    ...buttonStyles.secondaryText,
    color: colors.error,
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
    backgroundColor: colors.background.primary,
  },

  modalTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
  },

  closeButton: {
    padding: spacing[2],
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.tertiary,
  },

  closeButtonText: {
    ...textStyles.h4,
    color: colors.text.secondary,
  },

  modalContent: {
    flex: 1,
    padding: spacing[6],
  },

  formGroup: {
    marginBottom: spacing[6],
  },

  formLabel: {
    ...textStyles.body,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing[2],
  },

  formInput: {
    ...textStyles.body,
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.border.primary,
    borderRadius: borderRadius.base,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    color: colors.text.primary,
  },

  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },

  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
  },

  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderRadius: borderRadius.base,
    borderWidth: 1,
    borderColor: colors.border.primary,
    backgroundColor: colors.background.primary,
  },

  radioOptionSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },

  radioIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: spacing[2],
    opacity: 0.3,
  },

  radioIndicatorSelected: {
    opacity: 1,
  },

  radioLabel: {
    ...textStyles.body,
    color: colors.text.primary,
  },

  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.border.primary,
    backgroundColor: colors.background.primary,
    gap: spacing[3],
  },

  cancelButton: {
    ...buttonStyles.secondary,
    flex: 1,
  },

  cancelButtonText: {
    ...buttonStyles.secondaryText,
  },

  saveButton: {
    ...buttonStyles.primary,
    flex: 1,
  },

  saveButtonText: {
    ...buttonStyles.primaryText,
  },

  // Dropdown styles
  formInputText: {
    ...textStyles.body,
    color: colors.text.primary,
    flex: 1,
  },

  dropdownArrow: {
    ...textStyles.body,
    color: colors.text.tertiary,
    marginLeft: spacing[2],
  },

  dropdownContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.border.primary,
    borderTopWidth: 0,
    borderBottomLeftRadius: borderRadius.base,
    borderBottomRightRadius: borderRadius.base,
    maxHeight: 250,
    zIndex: 1000,
    ...shadows.md,
  },

  dropdownList: {
    maxHeight: 200,
    flexGrow: 0,
  },

  dropdownItem: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },

  dropdownItemSelected: {
    backgroundColor: colors.primary[50],
  },

  dropdownItemText: {
    ...textStyles.body,
    color: colors.text.primary,
  },

  dropdownItemTextSelected: {
    color: colors.primary[600],
    fontWeight: typography.fontWeight.semibold,
  },

  // Search in dropdown styles
  dropdownSearchContainer: {
    padding: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },

  dropdownSearchInput: {
    ...textStyles.body,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.primary,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
  },

  noResultsContainer: {
    padding: spacing[4],
    alignItems: 'center',
  },

  noResultsText: {
    ...textStyles.body,
    color: colors.text.tertiary,
    fontStyle: 'italic',
  },

  // Product image styles
  productImageContainer: {
    marginBottom: spacing[3],
    alignItems: 'center',
  },

  productImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.base,
    backgroundColor: colors.background.tertiary,
  },
});
