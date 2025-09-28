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

const EUROPEAN_COUNTRIES = [
  'Albania', 'Andorra', 'Austria', 'Belarus', 'Belgium', 'Bosnia and Herzegovina',
  'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'Estonia',
  'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland',
  'Italy', 'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Malta',
  'Moldova', 'Monaco', 'Montenegro', 'Netherlands', 'North Macedonia', 'Norway',
  'Poland', 'Portugal', 'Romania', 'Russia', 'San Marino', 'Serbia', 'Slovakia',
  'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'Ukraine', 'United Kingdom',
  'Vatican City'
];

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
    halalStatus: 'halal' as 'halal' | 'haram',
    country: '',
  });
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        halalStatus: (product.halalStates?.default === 'halal' || product.halalStates?.default === 'haram') 
          ? product.halalStates.default 
          : 'halal',
        country: product.country || '',
      });
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
        perCountry: formData.country ? { [formData.country]: formData.halalStatus } : undefined,
      },
      country: formData.country || undefined,
      lastUpdated: new Date(),
    };

    onSave(product.id, updateData);
  };

  const handleClose = () => {
    setFormData({
      name: '',
      halalStatus: 'halal',
      country: '',
    });
    setShowCountryDropdown(false);
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

            <View style={[adminPanelStyles.formGroup, { position: 'relative' }]}>
              <Text style={adminPanelStyles.formLabel}>{t('admin.country')}</Text>
              <TouchableOpacity
                style={[adminPanelStyles.formInput, { flexDirection: 'row', alignItems: 'center' }]}
                onPress={() => setShowCountryDropdown(!showCountryDropdown)}
              >
                <Text style={[
                  adminPanelStyles.formInputText,
                  !formData.country && { color: colors.text.tertiary }
                ]}>
                  {formData.country || t('admin.country')}
                </Text>
                <Text style={adminPanelStyles.dropdownArrow}>
                  {showCountryDropdown ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>
              
              {showCountryDropdown && (
                <View style={adminPanelStyles.dropdownContainer}>
                  <ScrollView style={adminPanelStyles.dropdownList} nestedScrollEnabled>
                    {EUROPEAN_COUNTRIES.map((country) => (
                      <TouchableOpacity
                        key={country}
                        style={[
                          adminPanelStyles.dropdownItem,
                          formData.country === country && adminPanelStyles.dropdownItemSelected
                        ]}
                        onPress={() => {
                          setFormData({ ...formData, country });
                          setShowCountryDropdown(false);
                        }}
                      >
                        <Text style={[
                          adminPanelStyles.dropdownItemText,
                          formData.country === country && adminPanelStyles.dropdownItemTextSelected
                        ]}>
                          {country}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

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
