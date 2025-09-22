import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { isRTL, getTextDirection } from '../i18n';

interface LanguageSwitcherProps {
  style?: any;
  compact?: boolean;
}

const languages = [
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ style, compact = false }) => {
  const { i18n, t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const currentLanguage = i18n.language;
  const isCurrentRTL = isRTL(currentLanguage);
  const textDirection = getTextDirection(currentLanguage);

  const currentLangData = languages.find(lang => lang.code === currentLanguage) || languages[0];

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setModalVisible(false);
  };

  const styles = StyleSheet.create({
    container: {
      ...style,
    },
    button: {
      flexDirection: isCurrentRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      paddingHorizontal: compact ? 8 : 10,
      paddingVertical: compact ? 4 : 6,
      backgroundColor: compact ? 'transparent' : '#f8f9fa',
      borderRadius: compact ? 4 : 6,
      borderWidth: compact ? 0 : 1,
      borderColor: '#e9ecef',
      minWidth: compact ? 60 : 80,
    },
    buttonText: {
      fontSize: compact ? 10 : 12,
      fontWeight: '500',
      color: '#495057',
      marginHorizontal: compact ? 2 : 4,
    },
    flag: {
      fontSize: compact ? 12 : 14,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 20,
      width: Dimensions.get('window').width * 0.8,
      maxWidth: 300,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: 20,
      color: '#212529',
    },
    languageItem: {
      flexDirection: isCurrentRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginBottom: 8,
    },
    languageItemActive: {
      backgroundColor: '#e3f2fd',
    },
    languageItemText: {
      fontSize: 16,
      color: '#495057',
      marginHorizontal: 12,
      flex: 1,
    },
    languageItemTextActive: {
      color: '#1976d2',
      fontWeight: '600',
    },
    checkmark: {
      fontSize: 16,
      color: '#1976d2',
    },
    closeButton: {
      marginTop: 16,
      paddingVertical: 12,
      backgroundColor: '#6c757d',
      borderRadius: 8,
      alignItems: 'center',
    },
    closeButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '500',
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.flag}>{currentLangData.flag}</Text>
        <Text style={styles.buttonText}>{currentLangData.name}</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {t('language.selectLanguage')}
            </Text>
            
            {languages.map((language) => {
              const isActive = language.code === currentLanguage;
              const isItemRTL = isRTL(language.code);
              
              return (
                <TouchableOpacity
                  key={language.code}
                  style={[
                    styles.languageItem,
                    isActive && styles.languageItemActive,
                    { flexDirection: isItemRTL ? 'row-reverse' : 'row' }
                  ]}
                  onPress={() => changeLanguage(language.code)}
                >
                  <Text style={styles.flag}>{language.flag}</Text>
                  <Text
                    style={[
                      styles.languageItemText,
                      isActive && styles.languageItemTextActive,
                    ]}
                  >
                    {language.name}
                  </Text>
                  {isActive && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              );
            })}
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>{t('common.close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
