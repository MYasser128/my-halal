import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { colors } from '../styles/theme';
import { useTranslation } from 'react-i18next';

interface ProductImageProps {
  imageUrl: string;
  fallbackIcon?: string;
  style?: any;
  showPlaceholder?: boolean;
  onPress?: () => void;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  imageUrl,
  fallbackIcon = '📦',
  style,
  showPlaceholder = true,
  onPress,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleImageLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleImageError = () => {
    setLoading(false);
    setError(true);
  };

  const renderPlaceholder = () => (
    <View style={[styles.placeholder, style]}>
      <Text style={styles.placeholderIcon}>{fallbackIcon}</Text>
      <Text style={styles.placeholderText}>{t('productImage.noImage')}</Text>
    </View>
  );

  const renderImage = () => (
    <Image
      source={{ uri: imageUrl }}
      style={[styles.image, style]}
      onLoad={handleImageLoad}
      onError={handleImageError}
      resizeMode="cover"
    />
  );

  const renderContent = () => {
    if (error || !imageUrl) {
      return showPlaceholder ? renderPlaceholder() : null;
    }

    return (
      <View style={[styles.container, style]}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.primary[500]} />
          </View>
        )}
        {renderImage()}
      </View>
    );
  };

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return renderContent();
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
  },
  placeholder: {
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.primary,
    borderRadius: 8,
  },
  placeholderIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  placeholderText: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
});
