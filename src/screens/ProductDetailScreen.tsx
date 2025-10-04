import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Image, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { productDetailStyles } from '../styles/ProductDetail.styles';
import { ProductImage } from '../components/ProductImage';
import { ImageViewer } from '../components/ImageViewer';

interface ProductDetailScreenProps {
  barcode: string;
  onBack: () => void;
  onScanAgain: () => void;
}

interface ProductData {
  id: string;
  name: string;
  barcode: string;
  halalStates: {
    default: 'halal' | 'haram' | 'suspicious';
  };
  ingredients?: string[];
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
    valid: boolean;
  }>;
  manufacturer?: string;
  category?: string;
  description?: string;
  images?: string[];
  lastUpdated?: Date;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ 
  barcode, 
  onBack, 
  onScanAgain 
}) => {
  const { t } = useTranslation();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewingImages, setViewingImages] = useState<{images: string[], currentIndex: number} | null>(null);

  useEffect(() => {
    loadProduct();
  }, [barcode]);

  const loadProduct = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Clean the barcode data to make it a valid document ID
      const cleanBarcode = barcode.replace(/[^a-zA-Z0-9_-]/g, '_');
      
      // Look for product in Firestore
      const docRef = doc(db, "products", cleanBarcode);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const productData = docSnap.data() as ProductData;
        setProduct({
          ...productData,
          id: docSnap.id,
        });
      } else {
        setError(t('scanner.productNotFound'));
      }
    } catch (error) {
      console.error('Error loading product:', error);
      setError(t('scanner.somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'halal':
        return productDetailStyles.halalStatus;
      case 'haram':
        return productDetailStyles.haramStatus;
      case 'suspicious':
        return productDetailStyles.suspiciousStatus;
      default:
        return productDetailStyles.haramStatus; // Default to haram if status is unclear
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'halal':
        return t('product.halal').toUpperCase();
      case 'haram':
        return t('product.haram').toUpperCase();
      case 'suspicious':
        return t('product.suspicious').toUpperCase();
      default:
        return t('product.haram').toUpperCase(); // Default to haram if status is unclear
    }
  };

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    try {
      return new Date(date.seconds ? date.seconds * 1000 : date).toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  if (loading) {
    return (
      <View style={productDetailStyles.container}>
        <View style={productDetailStyles.header}>
          <View style={productDetailStyles.headerContent}>
            <TouchableOpacity style={productDetailStyles.backButton} onPress={onBack}>
              <Text style={productDetailStyles.backButtonText}>← {t('common.back')}</Text>
            </TouchableOpacity>
            <Text style={productDetailStyles.headerTitle}>{t('product.productName')}</Text>
          </View>
        </View>
        <View style={productDetailStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#22c55e" />
          <Text style={productDetailStyles.loadingText}>{t('common.loading')}</Text>
        </View>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={productDetailStyles.container}>
        <View style={productDetailStyles.header}>
          <View style={productDetailStyles.headerContent}>
            <TouchableOpacity style={productDetailStyles.backButton} onPress={onBack}>
              <Text style={productDetailStyles.backButtonText}>← {t('common.back')}</Text>
            </TouchableOpacity>
            <Text style={productDetailStyles.headerTitle}>{t('product.productName')}</Text>
          </View>
        </View>
        <View style={productDetailStyles.content}>
          <View style={productDetailStyles.emptyContainer}>
            <Text style={productDetailStyles.emptyIcon}>❌</Text>
            <Text style={productDetailStyles.emptyTitle}>{t('scanner.productNotFound')}</Text>
            <Text style={productDetailStyles.emptyText}>
              {t('scanner.productUnknownDescription')}
            </Text>
            <View style={productDetailStyles.actionButtons}>
              <TouchableOpacity style={productDetailStyles.primaryButton} onPress={onScanAgain}>
                <Text style={productDetailStyles.primaryButtonText}>{t('scanner.scanAgain')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={productDetailStyles.container}>
      <View style={productDetailStyles.header}>
        <View style={productDetailStyles.headerContent}>
          <TouchableOpacity style={productDetailStyles.backButton} onPress={onBack}>
            <Text style={productDetailStyles.backButtonText}>← {t('common.back')}</Text>
          </TouchableOpacity>
          <Text style={productDetailStyles.headerTitle}>{t('product.productName')}</Text>
        </View>
      </View>

      <ScrollView style={productDetailStyles.content}>
        {/* Product Images */}
        {product.images && product.images.length > 0 && (
          <View style={productDetailStyles.imagesSection}>
            <Text style={productDetailStyles.sectionTitle}>{t('product.images')}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={productDetailStyles.imagesScrollView}
            >
              {product.images.map((imageUrl, index) => (
                <ProductImage
                  key={index}
                  imageUrl={imageUrl}
                  style={productDetailStyles.productImage}
                  onPress={() => setViewingImages({
                    images: product.images!,
                    currentIndex: index
                  })}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Product Info Card */}
        <View style={productDetailStyles.productCard}>
          <View style={productDetailStyles.productHeader}>
            <Text style={productDetailStyles.productName}>
              {product.name || t('product.unknown')}
            </Text>
            <View style={[productDetailStyles.statusBadge, getStatusColor(product.halalStates?.default || 'unknown')]}>
              <Text style={productDetailStyles.statusText}>
                {getStatusText(product.halalStates?.default || 'unknown')}
              </Text>
            </View>
          </View>

          <View style={productDetailStyles.productDetails}>
            <View style={productDetailStyles.detailRow}>
              <Text style={productDetailStyles.detailLabel}>{t('product.barcode')}:</Text>
              <Text style={productDetailStyles.detailValue}>{product.barcode}</Text>
            </View>
            
            {product.manufacturer && (
              <View style={productDetailStyles.detailRow}>
                <Text style={productDetailStyles.detailLabel}>{t('product.brand')}:</Text>
                <Text style={productDetailStyles.detailValue}>{product.manufacturer}</Text>
              </View>
            )}
            
            
            {product.category && (
              <View style={productDetailStyles.detailRow}>
                <Text style={productDetailStyles.detailLabel}>{t('product.category')}:</Text>
                <Text style={productDetailStyles.detailValue}>{product.category}</Text>
              </View>
            )}
            
            {product.lastUpdated && (
              <View style={productDetailStyles.detailRow}>
                <Text style={productDetailStyles.detailLabel}>{t('product.lastUpdated')}:</Text>
                <Text style={productDetailStyles.detailValue}>{formatDate(product.lastUpdated)}</Text>
              </View>
            )}
          </View>

          <View style={productDetailStyles.barcodeSection}>
            <Text style={productDetailStyles.barcodeLabel}>{t('product.barcode')}</Text>
            <Text style={productDetailStyles.barcodeValue}>{product.barcode}</Text>
          </View>
        </View>

        {/* Description */}
        {product.description && (
          <View style={productDetailStyles.productCard}>
            <Text style={productDetailStyles.sectionTitle}>{t('product.description')}</Text>
            <Text style={productDetailStyles.detailValue}>{product.description}</Text>
          </View>
        )}

        {/* Ingredients */}
        {product.ingredients && product.ingredients.length > 0 && (
          <View style={productDetailStyles.ingredientsSection}>
            <Text style={productDetailStyles.sectionTitle}>{t('product.ingredients')}</Text>
            <View style={productDetailStyles.ingredientsList}>
              {product.ingredients.map((ingredient, index) => (
                <Text key={index} style={productDetailStyles.ingredientItem}>
                  • {ingredient}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Certifications */}
        {product.certifications && product.certifications.length > 0 && (
          <View style={productDetailStyles.certificationSection}>
            <Text style={productDetailStyles.sectionTitle}>{t('product.certification')}</Text>
            {product.certifications.map((cert, index) => (
              <View key={index} style={productDetailStyles.certificationCard}>
                <Text style={productDetailStyles.certificationTitle}>{cert.name}</Text>
                <Text style={productDetailStyles.certificationDetails}>
                  {t('product.issuedBy')}: {cert.issuer}
                </Text>
                <Text style={productDetailStyles.certificationDate}>
                  {t('product.date')}: {formatDate(cert.date)} • {t('product.status')}: {cert.valid ? t('product.valid') : t('product.expired')}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View style={productDetailStyles.actionButtons}>
          <TouchableOpacity style={productDetailStyles.primaryButton} onPress={onScanAgain}>
            <Text style={productDetailStyles.primaryButtonText}>{t('scanner.scanAgain')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={productDetailStyles.secondaryButton} onPress={onBack}>
            <Text style={productDetailStyles.secondaryButtonText}>{t('common.back')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ImageViewer
        visible={viewingImages !== null}
        images={viewingImages?.images || []}
        currentIndex={viewingImages?.currentIndex || 0}
        onClose={() => setViewingImages(null)}
        onIndexChange={(index) => setViewingImages(prev => 
          prev ? { ...prev, currentIndex: index } : null
        )}
      />
    </View>
  );
};
