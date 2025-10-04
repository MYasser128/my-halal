import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  ImageStyle,
} from 'react-native';
import { pickImage, takePhoto, uploadImageToStorage, ImageUploadResult } from '../services/imageUpload';
import { colors } from '../styles/theme';
import { useTranslation } from 'react-i18next';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  productId: string;
  maxImages?: number;
  disabled?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onImagesChange,
  productId,
  maxImages = 5,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handlePickImage = async () => {
    if (disabled || uploading) return;

    Alert.alert(
      t('imageUpload.selectImage'),
      t('imageUpload.chooseImageMethod'),
      [
        { text: t('imageUpload.cancel'), style: 'cancel' },
        { text: t('imageUpload.camera'), onPress: handleTakePhoto },
        { text: t('imageUpload.gallery'), onPress: handleSelectFromGallery },
      ]
    );
  };

  const handleSelectFromGallery = async () => {
    try {
      const result = await pickImage();
      
      if (!result.canceled && result.assets && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        await handleUploadImage(imageUri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(t('imageUpload.error'), t('imageUpload.failedToPickImage'));
    }
  };

  const handleTakePhoto = async () => {
    try {
      const result = await takePhoto();
      
      if (!result.canceled && result.assets && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        await handleUploadImage(imageUri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert(t('imageUpload.error'), t('imageUpload.failedToTakePhoto'));
    }
  };

  const handleUploadImage = async (imageUri: string) => {
    if (images.length >= maxImages) {
      Alert.alert(t('imageUpload.limitReached'), t('imageUpload.maxImagesReached', { max: maxImages }));
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const result: ImageUploadResult = await uploadImageToStorage(
        imageUri,
        productId,
        (progress) => setUploadProgress(progress)
      );

      if (result.success && result.url) {
        onImagesChange([...images, result.url]);
        Alert.alert(t('imageUpload.success'), t('imageUpload.imageUploadedSuccess'));
      } else {
        Alert.alert(t('imageUpload.error'), result.error || t('imageUpload.failedToUploadImage'));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert(t('imageUpload.error'), t('imageUpload.failedToUploadImage'));
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveImage = (index: number) => {
    if (disabled) return;

    Alert.alert(
      t('imageUpload.removeImage'),
      t('imageUpload.removeImageConfirm'),
      [
        { text: t('imageUpload.cancel'), style: 'cancel' },
        {
          text: t('imageUpload.remove'),
          style: 'destructive',
          onPress: () => {
            const newImages = images.filter((_, i) => i !== index);
            onImagesChange(newImages);
          },
        },
      ]
    );
  };

  const renderImage = (imageUrl: string, index: number) => (
    <View key={index} style={styles.imageContainer}>
      <Image source={{ uri: imageUrl }} style={{width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: colors.background.secondary}}  />
      {!disabled && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveImage(index)}
        >
          <Text style={styles.removeButtonText}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('imageUpload.productImages')}</Text>
      <Text style={styles.subLabel}>
        {t('imageUpload.imagesUploaded', { current: images.length, max: maxImages })}
      </Text>

      {images.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.imageScrollView}
        >
          {images.map((imageUrl, index) => renderImage(imageUrl, index))}
        </ScrollView>
      )}

      {!disabled && images.length < maxImages && (
        <TouchableOpacity
          style={[styles.uploadButton, uploading && styles.uploadButtonDisabled]}
          onPress={handlePickImage}
          disabled={uploading}
        >
          {uploading ? (
            <View style={styles.uploadingContainer}>
              <ActivityIndicator size="small" color={colors.primary[500]} />
              <Text style={styles.uploadingText}>
                {t('imageUpload.uploadingProgress', { progress: Math.round(uploadProgress) })}
              </Text>
            </View>
          ) : (
            <View style={styles.uploadContent}>
              <Text style={styles.uploadIcon}>📷</Text>
              <Text style={styles.uploadText}>{t('imageUpload.addImage')}</Text>
            </View>
          )}
        </TouchableOpacity>
      )}

      {images.length === 0 && !uploading && (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderIcon}>🖼️</Text>
          <Text style={styles.placeholderText}>{t('imageUpload.noImagesUploaded')}</Text>
          <Text style={styles.placeholderSubtext}>
            {t('imageUpload.tapToUpload')}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  subLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 12,
  },
  imageScrollView: {
    marginBottom: 12,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  image: {
    
  } as ImageStyle,
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.background.primary,
  },
  removeButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: colors.border.primary,
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
  },
  uploadButtonDisabled: {
    opacity: 0.6,
  },
  uploadingContainer: {
    alignItems: 'center',
  },
  uploadingText: {
    marginTop: 8,
    fontSize: 12,
    color: colors.text.secondary,
  },
  uploadContent: {
    alignItems: 'center',
  },
  uploadIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  uploadText: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '500',
  },
  placeholderContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  placeholderIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  placeholderSubtext: {
    fontSize: 12,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
});
