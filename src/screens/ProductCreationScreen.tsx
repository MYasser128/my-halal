import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { productCreationStyles } from '../styles/ProductCreation.styles';
import { isAdmin } from '../services/auth';
import { User } from 'firebase/auth';

interface ProductCreationScreenProps {
  barcode: string;
  onBack: () => void;
  onSuccess: () => void;
  user: User | null;
  onNavigateToLogin?: () => void;
}


export const ProductCreationScreen: React.FC<ProductCreationScreenProps> = ({ 
  barcode, 
  onBack, 
  onSuccess,
  user,
  onNavigateToLogin
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    halalStatus: 'halal' as 'halal' | 'haram' | 'suspicious',
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  // Check admin status on component mount
  React.useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        const adminStatus = await isAdmin(user);
        setIsUserAdmin(adminStatus);
      }
    };
    checkAdminStatus();
  }, [user]);

  // Show anonymous reporting notice for guest users
  const isAnonymous = !user;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }


    // Halal status validation removed since we only have halal/haram options

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in the product name');
      return;
    }

    setLoading(true);
    
    try {
      // Clean the barcode data to make it a valid document ID
      const cleanBarcode = barcode.replace(/[^a-zA-Z0-9_-]/g, '_');
      
      if (user) {
        // Check if user is admin
        const userIsAdmin = await isAdmin(user);
        
        if (userIsAdmin) {
          // Admin: Add directly to products collection with same structure as approveReport
          const productData = {
            barcode: barcode,
            name: formData.name.trim(),
            lastUpdated: new Date(),
            createdByAdmin: user.uid,
            verificationHistory: [{
              adminId: user.uid,
              action: 'created',
              notes: 'Product created directly by admin',
              timestamp: new Date()
            }],
            halalStates: {
              default: formData.halalStatus,
            },
            createdAt: new Date(),
            status: 'verified',
          };

          await setDoc(doc(db, "products", cleanBarcode), productData);

          Alert.alert(
            'Success!', 
            'Product has been added directly to the database as an admin.',
            [
              {
                text: 'OK',
                onPress: onSuccess,
              }
            ]
          );
        } else {
          // Regular user: Add to reports collection for admin approval
          const reportData = {
            barcode: barcode,
            name: formData.name.trim(),
            suggestedState: formData.halalStatus,
            reporterId: user.uid,
            reporterEmail: user.email || '',
            status: 'pending',
            notes: 'Product creation request',
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          const reportId = `${cleanBarcode}_${Date.now()}`;
          await setDoc(doc(db, "reports", reportId), reportData);

          Alert.alert(
            'Success!', 
            'Product has been submitted for admin approval. You will be notified once it\'s reviewed.',
            [
              {
                text: 'OK',
                onPress: onSuccess,
              }
            ]
          );
        }
      } else {
        // Anonymous user: Add to reports collection without reporterId
        const reportData = {
          barcode: barcode,
          name: formData.name.trim(),
          suggestedState: formData.halalStatus,
          status: 'pending',
          notes: 'Product creation request from anonymous user',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const reportId = `${cleanBarcode}_${Date.now()}`;
        await setDoc(doc(db, "reports", reportId), reportData);

        Alert.alert(
          'Success!', 
          'Product has been submitted for admin approval. Thank you for your contribution!',
          [
            {
              text: 'OK',
              onPress: onSuccess,
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error creating product:', error);
      Alert.alert('Error', 'Failed to create product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <View style={productCreationStyles.container}>
      <View style={productCreationStyles.header}>
        <View style={productCreationStyles.headerContent}>
          <TouchableOpacity style={productCreationStyles.backButton} onPress={onBack}>
            <Text style={productCreationStyles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={productCreationStyles.headerTitle}>Add New Product</Text>
        </View>
      </View>

      <ScrollView style={productCreationStyles.content}>
        <View style={productCreationStyles.formContainer}>
          <Text style={productCreationStyles.formTitle}>
            {isUserAdmin ? 'Add New Product (Admin)' : 
             isAnonymous ? 'Report Product (Anonymous)' : 'Submit Product for Review'}
          </Text>
          <Text style={productCreationStyles.formSubtitle}>
            {isUserAdmin 
              ? 'Add this product directly to the database' 
              : isAnonymous
              ? 'Submit this product for admin approval (no login required)'
              : 'Submit this product for admin approval'
            }
          </Text>
          
          {isUserAdmin && (
            <View style={{
              backgroundColor: '#dcfce7',
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 20,
              alignSelf: 'center',
              marginBottom: 24,
              borderWidth: 1,
              borderColor: '#86efac',
            }}>
              <Text style={{
                fontSize: 12,
                color: '#166534',
                fontWeight: '600',
              }}>👑 Admin Mode</Text>
            </View>
          )}
          
          {isAnonymous && (
            <View style={{
              backgroundColor: '#fef3c7',
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 20,
              alignSelf: 'center',
              marginBottom: 24,
              borderWidth: 1,
              borderColor: '#fcd34d',
            }}>
              <Text style={{
                fontSize: 12,
                color: '#92400e',
                fontWeight: '600',
              }}>👤 Anonymous Mode</Text>
            </View>
          )}
          
          {/* Barcode Display */}
          <View style={productCreationStyles.barcodeSection}>
            <Text style={productCreationStyles.barcodeLabel}>Scanned Barcode</Text>
            <Text style={productCreationStyles.barcodeValue}>{barcode}</Text>
          </View>

          {/* Product Name */}
          <View style={productCreationStyles.inputContainer}>
            <Text style={productCreationStyles.label}>Product Name *</Text>
            <TextInput
              style={[productCreationStyles.input, errors.name && productCreationStyles.inputError]}
              value={formData.name}
              onChangeText={(value) => updateFormData('name', value)}
              placeholder="Enter product name"
              placeholderTextColor="#9CA3AF"
            />
            {errors.name && <Text style={productCreationStyles.errorText}>{errors.name}</Text>}
          </View>

          {/* Halal Status */}
          <View style={productCreationStyles.statusSection}>
            <Text style={productCreationStyles.statusTitle}>Halal Status *</Text>
            <View style={productCreationStyles.statusOptions}>
              <TouchableOpacity
                style={[
                  productCreationStyles.statusOption,
                  formData.halalStatus === 'halal' && productCreationStyles.statusOptionSelected
                ]}
                onPress={() => updateFormData('halalStatus', 'halal')}
              >
                <Text style={[
                  productCreationStyles.statusOptionText,
                  formData.halalStatus === 'halal' && productCreationStyles.statusOptionTextSelected
                ]}>
                  ✅ Halal
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  productCreationStyles.statusOption,
                  formData.halalStatus === 'haram' && productCreationStyles.statusOptionSelected
                ]}
                onPress={() => updateFormData('halalStatus', 'haram')}
              >
                <Text style={[
                  productCreationStyles.statusOptionText,
                  formData.halalStatus === 'haram' && productCreationStyles.statusOptionTextSelected
                ]}>
                  ❌ Haram
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  productCreationStyles.statusOption,
                  formData.halalStatus === 'suspicious' && productCreationStyles.statusOptionSelected
                ]}
                onPress={() => updateFormData('halalStatus', 'suspicious')}
              >
                <Text style={[
                  productCreationStyles.statusOptionText,
                  formData.halalStatus === 'suspicious' && productCreationStyles.statusOptionTextSelected
                ]}>
                  ⚠️ Suspicious
                </Text>
              </TouchableOpacity>
            </View>
            {errors.halalStatus && <Text style={productCreationStyles.errorText}>{errors.halalStatus}</Text>}
          </View>


          {/* Action Buttons */}
          <View style={productCreationStyles.actionButtons}>
            <TouchableOpacity
              style={[
                loading ? productCreationStyles.submitButtonDisabled : productCreationStyles.submitButton
              ]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <View style={productCreationStyles.loadingContainer}>
                  <ActivityIndicator color="#ffffff" size="small" />
                  <Text style={productCreationStyles.loadingText}>Creating...</Text>
                </View>
              ) : (
                <Text style={productCreationStyles.submitButtonText}>
                  {isUserAdmin ? 'Add Product' : 
                   isAnonymous ? 'Report Product' : 'Submit for Review'}
                </Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity style={productCreationStyles.cancelButton} onPress={onBack}>
              <Text style={productCreationStyles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
