import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { productDetailStyles } from '../styles/ProductDetail.styles';

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
    default: 'halal' | 'haram';
  };
  ingredients?: string[];
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
    valid: boolean;
  }>;
  manufacturer?: string;
  country?: string;
  category?: string;
  description?: string;
  lastUpdated?: Date;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ 
  barcode, 
  onBack, 
  onScanAgain 
}) => {
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setError('Product not found in database');
      }
    } catch (error) {
      console.error('Error loading product:', error);
      setError('Failed to load product information');
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
      default:
        return productDetailStyles.haramStatus; // Default to haram if status is unclear
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'halal':
        return 'HALAL';
      case 'haram':
        return 'HARAM';
      default:
        return 'HARAM'; // Default to haram if status is unclear
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
              <Text style={productDetailStyles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <Text style={productDetailStyles.headerTitle}>Product Details</Text>
          </View>
        </View>
        <View style={productDetailStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#22c55e" />
          <Text style={productDetailStyles.loadingText}>Loading product information...</Text>
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
              <Text style={productDetailStyles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <Text style={productDetailStyles.headerTitle}>Product Details</Text>
          </View>
        </View>
        <View style={productDetailStyles.content}>
          <View style={productDetailStyles.emptyContainer}>
            <Text style={productDetailStyles.emptyIcon}>❌</Text>
            <Text style={productDetailStyles.emptyTitle}>Product Not Found</Text>
            <Text style={productDetailStyles.emptyText}>
              This product is not available in our database. You can help by adding it to our collection.
            </Text>
            <View style={productDetailStyles.actionButtons}>
              <TouchableOpacity style={productDetailStyles.primaryButton} onPress={onScanAgain}>
                <Text style={productDetailStyles.primaryButtonText}>Scan Another Product</Text>
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
            <Text style={productDetailStyles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={productDetailStyles.headerTitle}>Product Details</Text>
        </View>
      </View>

      <ScrollView style={productDetailStyles.content}>
        {/* Product Info Card */}
        <View style={productDetailStyles.productCard}>
          <View style={productDetailStyles.productHeader}>
            <Text style={productDetailStyles.productName}>
              {product.name || 'Unknown Product'}
            </Text>
            <View style={[productDetailStyles.statusBadge, getStatusColor(product.halalStates?.default || 'unknown')]}>
              <Text style={productDetailStyles.statusText}>
                {getStatusText(product.halalStates?.default || 'unknown')}
              </Text>
            </View>
          </View>

          <View style={productDetailStyles.productDetails}>
            <View style={productDetailStyles.detailRow}>
              <Text style={productDetailStyles.detailLabel}>Barcode:</Text>
              <Text style={productDetailStyles.detailValue}>{product.barcode}</Text>
            </View>
            
            {product.manufacturer && (
              <View style={productDetailStyles.detailRow}>
                <Text style={productDetailStyles.detailLabel}>Manufacturer:</Text>
                <Text style={productDetailStyles.detailValue}>{product.manufacturer}</Text>
              </View>
            )}
            
            {product.country && (
              <View style={productDetailStyles.detailRow}>
                <Text style={productDetailStyles.detailLabel}>Country:</Text>
                <Text style={productDetailStyles.detailValue}>{product.country}</Text>
              </View>
            )}
            
            {product.category && (
              <View style={productDetailStyles.detailRow}>
                <Text style={productDetailStyles.detailLabel}>Category:</Text>
                <Text style={productDetailStyles.detailValue}>{product.category}</Text>
              </View>
            )}
            
            {product.lastUpdated && (
              <View style={productDetailStyles.detailRow}>
                <Text style={productDetailStyles.detailLabel}>Last Updated:</Text>
                <Text style={productDetailStyles.detailValue}>{formatDate(product.lastUpdated)}</Text>
              </View>
            )}
          </View>

          <View style={productDetailStyles.barcodeSection}>
            <Text style={productDetailStyles.barcodeLabel}>Barcode Number</Text>
            <Text style={productDetailStyles.barcodeValue}>{product.barcode}</Text>
          </View>
        </View>

        {/* Description */}
        {product.description && (
          <View style={productDetailStyles.productCard}>
            <Text style={productDetailStyles.sectionTitle}>Description</Text>
            <Text style={productDetailStyles.detailValue}>{product.description}</Text>
          </View>
        )}

        {/* Ingredients */}
        {product.ingredients && product.ingredients.length > 0 && (
          <View style={productDetailStyles.ingredientsSection}>
            <Text style={productDetailStyles.sectionTitle}>Ingredients</Text>
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
            <Text style={productDetailStyles.sectionTitle}>Certifications</Text>
            {product.certifications.map((cert, index) => (
              <View key={index} style={productDetailStyles.certificationCard}>
                <Text style={productDetailStyles.certificationTitle}>{cert.name}</Text>
                <Text style={productDetailStyles.certificationDetails}>
                  Issued by: {cert.issuer}
                </Text>
                <Text style={productDetailStyles.certificationDate}>
                  Date: {formatDate(cert.date)} • Status: {cert.valid ? 'Valid' : 'Expired'}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View style={productDetailStyles.actionButtons}>
          <TouchableOpacity style={productDetailStyles.primaryButton} onPress={onScanAgain}>
            <Text style={productDetailStyles.primaryButtonText}>Scan Another Product</Text>
          </TouchableOpacity>
          <TouchableOpacity style={productDetailStyles.secondaryButton} onPress={onBack}>
            <Text style={productDetailStyles.secondaryButtonText}>Back to Scanner</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
