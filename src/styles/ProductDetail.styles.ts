import { StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from './theme';
import { cardStyles, textStyles, buttonStyles, badgeStyles, layoutStyles } from './common';

export const productDetailStyles = StyleSheet.create({
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
  
  // Product info card
  productCard: {
    ...cardStyles.elevated,
    marginBottom: spacing[6],
  },
  
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[4],
  },
  
  productName: {
    ...textStyles.h2,
    color: colors.text.primary,
    flex: 1,
    marginRight: spacing[3],
  },
  
  statusBadge: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderRadius: borderRadius.full,
  },
  
  statusText: {
    ...textStyles.caption,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.inverse,
  },
  
  halalStatus: {
    backgroundColor: colors.halal,
  },
  
  haramStatus: {
    backgroundColor: colors.haram,
  },
  
  suspiciousStatus: {
    backgroundColor: colors.suspicious,
  },
  
  unknownStatus: {
    backgroundColor: colors.unknown,
  },
  
  // Product details
  productDetails: {
    marginBottom: spacing[4],
  },
  
  detailRow: {
    flexDirection: 'row',
    marginBottom: spacing[3],
    alignItems: 'flex-start',
  },
  
  detailLabel: {
    ...textStyles.caption,
    color: colors.text.tertiary,
    fontWeight: typography.fontWeight.semibold,
    width: 100,
    marginTop: spacing[1],
  },
  
  detailValue: {
    ...textStyles.body,
    color: colors.text.secondary,
    flex: 1,
  },
  
  // Barcode section
  barcodeSection: {
    backgroundColor: colors.background.tertiary,
    padding: spacing[4],
    borderRadius: borderRadius.base,
    marginBottom: spacing[4],
  },
  
  barcodeLabel: {
    ...textStyles.caption,
    color: colors.text.tertiary,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing[2],
  },
  
  barcodeValue: {
    ...textStyles.h4,
    color: colors.text.primary,
    fontFamily: 'monospace',
  },
  
  // Ingredients section
  ingredientsSection: {
    marginBottom: spacing[6],
  },
  
  sectionTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginBottom: spacing[4],
  },
  
  ingredientsList: {
    backgroundColor: colors.background.primary,
    padding: spacing[4],
    borderRadius: borderRadius.base,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  
  ingredientItem: {
    ...textStyles.body,
    color: colors.text.secondary,
    marginBottom: spacing[2],
    paddingLeft: spacing[2],
  },
  
  // Certification section
  certificationSection: {
    marginBottom: spacing[6],
  },
  
  certificationCard: {
    ...cardStyles.flat,
    marginBottom: spacing[3],
  },
  
  certificationTitle: {
    ...textStyles.h4,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  
  certificationDetails: {
    ...textStyles.bodySecondary,
    marginBottom: spacing[2],
  },
  
  certificationDate: {
    ...textStyles.caption,
    color: colors.text.tertiary,
  },
  
  // Action buttons
  actionButtons: {
    flexDirection: 'row',
    marginTop: spacing[6],
  },
  
  primaryButton: {
    ...buttonStyles.primary,
    flex: 1,
    marginRight: spacing[2],
  },
  
  primaryButtonText: {
    ...buttonStyles.primaryText,
  },
  
  secondaryButton: {
    ...buttonStyles.secondary,
    flex: 1,
    marginLeft: spacing[2],
  },
  
  secondaryButtonText: {
    ...buttonStyles.secondaryText,
  },
  
  // Loading states
  loadingContainer: {
    ...layoutStyles.center,
    padding: spacing[8],
  },
  
  loadingText: {
    ...textStyles.bodySecondary,
    marginTop: spacing[4],
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

  // Image section
  imagesSection: {
    marginBottom: spacing[6],
  },

  imagesScrollView: {
    marginTop: spacing[3],
  },

  productImage: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.base,
    marginRight: spacing[3],
    backgroundColor: colors.background.tertiary,
  },
});
