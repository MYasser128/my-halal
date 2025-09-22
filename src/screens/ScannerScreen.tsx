import React, { useState } from "react";
import { View, Text, Alert, TouchableOpacity, ActivityIndicator } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { scannerScreenStyles } from "../styles/ScannerScreen.styles";
import { ProductDetailScreen } from "./ProductDetailScreen";
import { ProductCreationScreen } from "./ProductCreationScreen";

interface ScannerScreenProps {
  onBack: () => void;
  user: any;
}

export default function ScannerScreen({ onBack, user }: ScannerScreenProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [barcodeData, setBarcodeData] = useState<string | null>(null);
  const [productState, setProductState] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [currentView, setCurrentView] = useState<'scanner' | 'productDetail' | 'productCreation' | 'productNotFound'>('scanner');

  if (!permission) {
    return (
      <View style={scannerScreenStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#22c55e" />
        <Text style={scannerScreenStyles.loadingText}>Loading camera permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={scannerScreenStyles.permissionContainer}>
        <Text style={scannerScreenStyles.permissionTitle}>Camera Permission Required</Text>
        <Text style={scannerScreenStyles.permissionDescription}>
          We need access to your camera to scan product barcodes and help you verify if products are halal.
        </Text>
        <TouchableOpacity style={scannerScreenStyles.permissionButton} onPress={requestPermission}>
          <Text style={scannerScreenStyles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Handle scanning
  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    setBarcodeData(data);

    try {
      // Clean the barcode data to make it a valid document ID
      const cleanBarcode = data.replace(/[^a-zA-Z0-9_-]/g, '_');
      
      // Look for product in Firestore
      const docRef = doc(db, "products", cleanBarcode);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const product = docSnap.data();
        setProductState(product.halalStates?.default || 'haram');
        setNotFound(false);
        // Navigate to product detail screen
        setCurrentView('productDetail');
      } else {
        setNotFound(true);
        setProductState(null);
        // Navigate to product not found screen first
        setCurrentView('productNotFound');
      }
    } catch (error) {
      console.error("Error checking product:", error);
      Alert.alert("Error", "Something went wrong while checking product");
    }
  };

  // Navigation functions
  const handleBackToScanner = () => {
    setCurrentView('scanner');
    setScanned(false);
    setBarcodeData(null);
    setProductState(null);
    setNotFound(false);
  };

  const handleScanAgain = () => {
    setCurrentView('scanner');
    setScanned(false);
    setBarcodeData(null);
    setProductState(null);
    setNotFound(false);
  };

  const handleReportProduct = () => {
    setCurrentView('productCreation');
  };

  const handleProductCreated = () => {
    Alert.alert("Success", "Product has been added to the database!");
    handleBackToScanner();
  };

  // Report product if not found (legacy function - now handled by product creation)
  const handleReport = async (state: "halal" | "haram") => {
    if (!barcodeData) return;

    try {
      const cleanBarcode = barcodeData.replace(/[^a-zA-Z0-9_-]/g, '_');
      const reportId = `${cleanBarcode}_${Date.now()}`;
      
      await setDoc(doc(db, "reports", reportId), {
        barcode: barcodeData,
        suggestedState: state,
        status: 'pending',
        reporterId: 'anonymous', // You might want to get this from auth
        country: 'Unknown',
        name: 'Unknown Product',
        notes: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      Alert.alert("Reported", `Product reported as ${state}. Waiting for admin approval.`);
      setNotFound(false);
    } catch (error) {
      console.error("Error reporting product:", error);
      Alert.alert("Error", "Could not report product");
    }
  };

  // Render different views based on current state
  if (currentView === 'productDetail' && barcodeData) {
    return (
      <ProductDetailScreen
        barcode={barcodeData}
        onBack={handleBackToScanner}
        onScanAgain={handleScanAgain}
      />
    );
  }

  if (currentView === 'productNotFound' && barcodeData) {
    return (
      <View style={scannerScreenStyles.container}>
        <View style={scannerScreenStyles.header}>
          <TouchableOpacity style={scannerScreenStyles.backButton} onPress={handleBackToScanner}>
            <Text style={scannerScreenStyles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={scannerScreenStyles.headerTitle}>Product Not Found</Text>
        </View>
        
        <View style={scannerScreenStyles.permissionContainer}>
          <View style={scannerScreenStyles.resultCard}>
            <Text style={scannerScreenStyles.resultTitle}>Product Unknown</Text>
            <Text style={scannerScreenStyles.resultDescription}>
              This product is not in our database yet. You can help by reporting it to our community.
            </Text>
            
            <View style={scannerScreenStyles.unknownBadge}>
              <Text style={scannerScreenStyles.unknownBadgeText}>Unknown Product</Text>
            </View>
            
            <Text style={scannerScreenStyles.resultDescription}>
              Barcode: {barcodeData}
            </Text>
            
            <TouchableOpacity 
              style={scannerScreenStyles.reportButton} 
              onPress={handleReportProduct}
            >
              <Text style={scannerScreenStyles.reportButtonText}>Report Product</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={scannerScreenStyles.scanAgainButton} 
              onPress={handleScanAgain}
            >
              <Text style={scannerScreenStyles.scanAgainButtonText}>Scan Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  if (currentView === 'productCreation' && barcodeData) {
    return (
      <ProductCreationScreen
        barcode={barcodeData}
        onBack={handleBackToScanner}
        onSuccess={handleProductCreated}
        user={user}
      />
    );
  }

  return (
    <View style={scannerScreenStyles.container}>
      <View style={scannerScreenStyles.header}>
        <TouchableOpacity style={scannerScreenStyles.backButton} onPress={onBack}>
          <Text style={scannerScreenStyles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={scannerScreenStyles.headerTitle}>Scan Product</Text>
      </View>
      
      <CameraView
        style={scannerScreenStyles.cameraOverlay}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e", "qr"],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />

      <View style={scannerScreenStyles.instructions}>
        <Text style={scannerScreenStyles.instructionsText}>
          Position the barcode within the frame to scan
        </Text>
      </View>
    </View>
  );
}

