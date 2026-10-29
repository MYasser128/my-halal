import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BackHandler,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import { ImageViewer } from "../components/ImageViewer";
import { ProductImage } from "../components/ProductImage";
import { useSafeAreaPadding } from "../hooks/useSafeAreaPadding";
import { productDetailStyles } from "../styles/ProductDetail.styles";

const adUnitId = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : Platform.select({
      android: "ca-app-pub-4190475427615963/9140513175",
      ios: "ca-app-pub-4190475427615963/8408963930",
    }) || TestIds.ADAPTIVE_BANNER;

export interface ProductData {
  id: string;
  name: string;
  barcode: string;
  halalStates: {
    default: "halal" | "haram" | "suspicious";
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

interface ProductDetailScreenProps {
  product: ProductData;
  onBack: () => void;
  onScanAgain: () => void;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  product,
  onBack,
  onScanAgain,
}) => {
  const { t } = useTranslation();
  const { insets, headerStyle } = useSafeAreaPadding();
  const [viewingImages, setViewingImages] = useState<{
    images: string[];
    currentIndex: number;
  } | null>(null);

  // Handle Android back button for image viewer modal
  useEffect(() => {
    const backAction = () => {
      if (Platform.OS === "android") {
        // If image viewer is open, close it
        if (viewingImages !== null) {
          setViewingImages(null);
          return true; // Prevent default behavior
        }
        // If no modal is open, let parent handle it
        return false; // Allow default behavior
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [viewingImages]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "halal":
        return productDetailStyles.halalStatus;
      case "haram":
        return productDetailStyles.haramStatus;
      case "suspicious":
        return productDetailStyles.suspiciousStatus;
      default:
        return productDetailStyles.haramStatus; // Default to haram if status is unclear
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "halal":
        return t("product.halal").toUpperCase();
      case "haram":
        return t("product.haram").toUpperCase();
      case "suspicious":
        return t("product.suspicious").toUpperCase();
      default:
        return t("product.haram").toUpperCase(); // Default to haram if status is unclear
    }
  };

  const formatDate = (date: any) => {
    if (!date) return "N/A";
    try {
      return new Date(
        date.seconds ? date.seconds * 1000 : date
      ).toLocaleDateString();
    } catch {
      return "N/A";
    }
  };

  return (
    <View style={productDetailStyles.container}>
      <View style={[productDetailStyles.header, headerStyle]}>
        <View style={productDetailStyles.headerContent}>
          <TouchableOpacity
            style={productDetailStyles.backButton}
            onPress={onBack}
          >
            <Text style={productDetailStyles.backButtonText}>
              ← {t("common.back")}
            </Text>
          </TouchableOpacity>
          <Text style={productDetailStyles.headerTitle}>
            {t("product.productName")}
          </Text>
        </View>
      </View>

      <ScrollView
        style={productDetailStyles.content}
        contentContainerStyle={productDetailStyles.scrollContent}
      >
        {/* Product Images */}
        {product.images && product.images.length > 0 && (
          <View style={productDetailStyles.imagesSection}>
            <Text style={productDetailStyles.sectionTitle}>
              {t("product.images")}
            </Text>
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
                  onPress={() =>
                    setViewingImages({
                      images: product.images!,
                      currentIndex: index,
                    })
                  }
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Product Info Card */}
        <View style={productDetailStyles.productCard}>
          <View style={productDetailStyles.productHeader}>
            <Text style={productDetailStyles.productName}>
              {product.name || t("product.unknown")}
            </Text>
            <View
              style={[
                productDetailStyles.statusBadge,
                getStatusColor(product.halalStates?.default || "unknown"),
              ]}
            >
              <Text style={productDetailStyles.statusText}>
                {getStatusText(product.halalStates?.default || "unknown")}
              </Text>
            </View>
          </View>

          <View style={productDetailStyles.productDetails}>
            <View style={productDetailStyles.detailRow}>
              <Text style={productDetailStyles.detailLabel}>
                {t("product.barcode")}:
              </Text>
              <Text style={productDetailStyles.detailValue}>
                {product.barcode}
              </Text>
            </View>

            {product.manufacturer && (
              <View style={productDetailStyles.detailRow}>
                <Text style={productDetailStyles.detailLabel}>
                  {t("product.brand")}:
                </Text>
                <Text style={productDetailStyles.detailValue}>
                  {product.manufacturer}
                </Text>
              </View>
            )}

            {product.category && (
              <View style={productDetailStyles.detailRow}>
                <Text style={productDetailStyles.detailLabel}>
                  {t("product.category")}:
                </Text>
                <Text style={productDetailStyles.detailValue}>
                  {product.category}
                </Text>
              </View>
            )}

            {product.lastUpdated && (
              <View style={productDetailStyles.detailRow}>
                <Text style={productDetailStyles.detailLabel}>
                  {t("product.lastUpdated")}:
                </Text>
                <Text style={productDetailStyles.detailValue}>
                  {formatDate(product.lastUpdated)}
                </Text>
              </View>
            )}
          </View>

          <View style={productDetailStyles.barcodeSection}>
            <Text style={productDetailStyles.barcodeLabel}>
              {t("product.barcode")}
            </Text>
            <Text style={productDetailStyles.barcodeValue}>
              {product.barcode}
            </Text>
          </View>
        </View>

        {/* Description */}
        {product.description && (
          <View style={productDetailStyles.productCard}>
            <Text style={productDetailStyles.sectionTitle}>
              {t("product.description")}
            </Text>
            <Text style={productDetailStyles.detailValue}>
              {product.description}
            </Text>
          </View>
        )}

        {/* Ingredients */}
        {product.ingredients && product.ingredients.length > 0 && (
          <View style={productDetailStyles.ingredientsSection}>
            <Text style={productDetailStyles.sectionTitle}>
              {t("product.ingredients")}
            </Text>
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
            <Text style={productDetailStyles.sectionTitle}>
              {t("product.certification")}
            </Text>
            {product.certifications.map((cert, index) => (
              <View key={index} style={productDetailStyles.certificationCard}>
                <Text style={productDetailStyles.certificationTitle}>
                  {cert.name}
                </Text>
                <Text style={productDetailStyles.certificationDetails}>
                  {t("product.issuedBy")}: {cert.issuer}
                </Text>
                <Text style={productDetailStyles.certificationDate}>
                  {t("product.date")}: {formatDate(cert.date)} •{" "}
                  {t("product.status")}:{" "}
                  {cert.valid ? t("product.valid") : t("product.expired")}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={productDetailStyles.actionButtons}>
          <TouchableOpacity
            style={productDetailStyles.primaryButton}
            onPress={onScanAgain}
          >
            <Text style={productDetailStyles.primaryButtonText}>
              {t("scanner.scanAgain")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View
        style={[
          productDetailStyles.bannerContainer,
          { paddingBottom: insets.bottom },
        ]}
      >
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        />
      </View>

      <ImageViewer
        visible={viewingImages !== null}
        images={viewingImages?.images || []}
        currentIndex={viewingImages?.currentIndex || 0}
        onClose={() => setViewingImages(null)}
        onIndexChange={(index) =>
          setViewingImages((prev) =>
            prev ? { ...prev, currentIndex: index } : null
          )
        }
      />
    </View>
  );
};
