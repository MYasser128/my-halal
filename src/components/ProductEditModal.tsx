import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Product, ProductUpdateData } from '../services/products';
import { adminPanelStyles } from '../styles/AdminPanel.styles';
import { colors } from '../styles/theme';
import { useTranslation } from 'react-i18next';
import { ImageUpload } from './ImageUpload';


interface ProductEditModalProps {
  visible: boolean;
  product: Product | null;
  onClose: () => void;
  onSave: (productId: string, updateData: ProductUpdateData) => void;
}

export const ProductEditModal: React.FC<ProductEditModalProps> = ({
  visible,
  product,
  onClose,
  onSave,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    halalStatus: 'halal' as 'halal' | 'haram' | 'suspicious',
  });
  const [images, setImages] = useState<string[]>([]);


  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        halalStatus: (product.halalStates?.default === 'halal' || product.halalStates?.default === 'haram' || product.halalStates?.default === 'suspicious') 
          ? product.halalStates.default 
          : 'halal',
      });
      setImages(product.images || []);
    }
  }, [product]);

  const handleSave = () => {
    if (!product) return;

    if (!formData.name.trim()) {
      Alert.alert(t('admin.validationError'), t('admin.productNameRequired'));
      return;
    }

    const updateData: ProductUpdateData = {
      name: formData.name.trim(),
      halalStates: {
        default: formData.halalStatus,
      },
      images: images.length > 0 ? images : undefined,
      lastUpdated: new Date(),
    };

    onSave(product.id, updateData);
  };

  const handleClose = () => {
    setFormData({
      name: '',
      halalStatus: 'halal',
    });
    setImages([]);
    onClose();
  };

  if (!product) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={adminPanelStyles.modalContainer}>
          <View style={adminPanelStyles.modalHeader}>
            <Text style={adminPanelStyles.modalTitle}>{t('admin.editProduct')}</Text>
            <TouchableOpacity onPress={handleClose} style={adminPanelStyles.closeButton}>
              <Text style={adminPanelStyles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={adminPanelStyles.modalContent}>
            <View style={adminPanelStyles.formGroup}>
              <Text style={adminPanelStyles.formLabel}>{t('admin.productName')} *</Text>
              <TextInput
                style={adminPanelStyles.formInput}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder={t('admin.productName')}
                placeholderTextColor={colors.text.tertiary}
              />
            </View>

            <View style={adminPanelStyles.formGroup}>
              <Text style={adminPanelStyles.formLabel}>{t('admin.halalStatus')}</Text>
              <View style={adminPanelStyles.radioGroup}>
                {[
                  { value: 'halal', label: t('product.halal'), color: colors.success },
                  { value: 'haram', label: t('product.haram'), color: colors.error },
                  { value: 'suspicious', label: t('product.suspicious'), color: colors.suspicious },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      adminPanelStyles.radioOption,
                      formData.halalStatus === option.value && adminPanelStyles.radioOptionSelected,
                    ]}
                    onPress={() => setFormData({ ...formData, halalStatus: option.value as any })}
                  >
                    <View
                      style={[
                        adminPanelStyles.radioIndicator,
                        { backgroundColor: option.color },
                        formData.halalStatus === option.value && adminPanelStyles.radioIndicatorSelected,
                      ]}
                    />
                    <Text style={adminPanelStyles.radioLabel}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <ImageUpload
              images={images}
              onImagesChange={setImages}
              productId={product.id}
              maxImages={5}
            />

          </ScrollView>

          <View style={adminPanelStyles.modalActions}>
            <TouchableOpacity style={adminPanelStyles.cancelButton} onPress={handleClose}>
              <Text style={adminPanelStyles.cancelButtonText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={adminPanelStyles.saveButton} onPress={handleSave}>
              <Text style={adminPanelStyles.saveButtonText}>{t('admin.saveChanges')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
