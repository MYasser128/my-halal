import { StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from './theme';
import { textStyles, buttonStyles, badgeStyles } from './common';

export const scannerScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[900],
  },
  
  // Header styles
  header: {
    position: 'absolute',
    top: spacing[0],
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 1,
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
  
  headerTitle: {
    ...textStyles.h4,
    color: colors.text.inverse,
    flex: 1,
  },
  
  // Camera overlay
  cameraOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  
  // Scanning frame
  scanningFrame: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    right: '10%',
    height: 200,
    borderWidth: 2,
    borderColor: colors.primary[500],
    borderRadius: borderRadius.lg,
    backgroundColor: 'transparent',
  },
  
  scanningFrameCorner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: colors.primary[500],
  },
  
  topLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: borderRadius.base,
  },
  
  topRight: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: borderRadius.base,
  },
  
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: borderRadius.base,
  },
  
  bottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: borderRadius.base,
  },
  
  // Instructions
  instructions: {
    position: 'absolute',
    top: '55%',
    left: spacing[5],
    right: spacing[5],
    alignItems: 'center',
    zIndex: 1,
  },
  
  instructionsText: {
    ...textStyles.body,
    color: colors.text.inverse,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: spacing[4],
    borderRadius: borderRadius.base,
  },
  
  // Result overlay
  resultOverlay: {
    position: 'absolute',
    bottom: spacing[20],
    left: spacing[5],
    right: spacing[5],
    alignItems: 'center',
    zIndex: 2,
  },
  
  resultCard: {
    backgroundColor: colors.background.primary,
    padding: spacing[6],
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    ...shadows.lg,
    minWidth: '80%',
  },
  
  resultTitle: {
    ...textStyles.h3,
    marginBottom: spacing[3],
    textAlign: 'center',
  },
  
  resultDescription: {
    ...textStyles.bodySecondary,
    textAlign: 'center',
    marginBottom: spacing[4],
  },
  
  // Status badges
  halalBadge: {
    ...badgeStyles.halal,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    marginBottom: spacing[4],
  },
  
  halalBadgeText: {
    ...badgeStyles.halalText,
    fontSize: typography.fontSize.base,
  },
  
  haramBadge: {
    ...badgeStyles.haram,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    marginBottom: spacing[4],
  },
  
  haramBadgeText: {
    ...badgeStyles.haramText,
    fontSize: typography.fontSize.base,
  },
  
  unknownBadge: {
    ...badgeStyles.unknown,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    marginBottom: spacing[4],
  },
  
  unknownBadgeText: {
    ...badgeStyles.unknownText,
    fontSize: typography.fontSize.base,
  },
  
  // Action buttons
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: spacing[4],
  },
  
  reportButton: {
    ...buttonStyles.primary,
    marginHorizontal: spacing[1],
    backgroundColor: colors.halal,
  },
  
  reportButtonText: {
    ...buttonStyles.primaryText,
  },
  
  reportHaramButton: {
    ...buttonStyles.primary,
    flex: 1,
    marginHorizontal: spacing[1],
    backgroundColor: colors.haram,
  },
  
  reportHaramButtonText: {
    ...buttonStyles.primaryText,
  },
  
  scanAgainButton: {
    ...buttonStyles.secondary,
    marginTop: spacing[4],
    width: '100%',
  },
  
  scanAgainButtonText: {
    ...buttonStyles.secondaryText,
  },
  
  // Permission screen
  permissionContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[6],
  },
  
  permissionTitle: {
    ...textStyles.h2,
    textAlign: 'center',
    marginBottom: spacing[4],
    color: colors.text.primary,
  },
  
  permissionDescription: {
    ...textStyles.bodySecondary,
    textAlign: 'center',
    marginBottom: spacing[8],
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.base,
  },
  
  permissionButton: {
    ...buttonStyles.primary,
    paddingVertical: spacing[5],
    paddingHorizontal: spacing[8],
  },
  
  permissionButtonText: {
    ...buttonStyles.primaryText,
  },
  
  // Loading screen
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
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
});
