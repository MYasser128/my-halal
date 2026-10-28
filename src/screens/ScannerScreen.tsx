import React, { useState, useEffect } from "react";
import { View, Text, Alert, TouchableOpacity, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform, BackHandler, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import { CameraView, useCameraPermissions } from "expo-camera";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useSafeAreaPadding } from "../hooks/useSafeAreaPadding";
import { scannerScreenStyles } from "../styles/ScannerScreen.styles";
import { ProductDetailScreen } from "./ProductDetailScreen";
import { ProductCreationScreen } from "./ProductCreationScreen";

interface ScannerScreenProps {
  onBack: () => void;
  user: any | null;
  onNavigateToLogin?: () => void;
}

export default function ScannerScreen({ onBack, user, onNavigateToLogin }: ScannerScreenProps) {
  const { t } = useTranslation();
  const { insets, overlayHeaderStyle, floatingBottomStyle, screenBottomStyle } =
    useSafeAreaPadding();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [barcodeData, setBarcodeData] = useState<string | null>(null);
  const [productState, setProductState] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [currentView, setCurrentView] = useState<'scanner' | 'productDetail' | 'productCreation' | 'productNotFound'>('scanner');
  const [manualInputMode, setManualInputMode] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [barcodeError, setBarcodeError] = useState('');

  // Handle Android back button for internal navigation
  useEffect(() => {
    const backAction = () => {
      if (Platform.OS === 'android') {
        // If not on main scanner view, go back to scanner
        if (currentView !== 'scanner') {
          handleBackToScanner();
          return true; // Prevent default behavior
        }
        // If on main scanner view, let parent handle it (go back to home)
        return false; // Allow default behavior
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [currentView]);

  if (!permission) {
    return (
      <View
        style={[
          scannerScreenStyles.loadingContainer,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <ActivityIndicator size="large" color="#22c55e" />
        <Text style={scannerScreenStyles.loadingText}>{t('scanner.loadingCameraPermissions')}</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View
        style={[
          scannerScreenStyles.permissionContainer,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <Text style={scannerScreenStyles.permissionTitle}>{t('scanner.cameraPermissionRequired')}</Text>
        <Text style={scannerScreenStyles.permissionDescription}>
          {t('scanner.cameraPermissionDescription')}
        </Text>
        <TouchableOpacity style={scannerScreenStyles.permissionButton} onPress={requestPermission}>
          <Text style={scannerScreenStyles.permissionButtonText}>{t('scanner.grantPermission')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Barcode validation function
  const validateBarcode = (barcode: string): { isValid: boolean; error?: string } => {
    const cleanBarcode = barcode.trim();
    
    if (!cleanBarcode) {
      return { isValid: false, error: t('scanner.pleaseEnterBarcode') };
    }
    
    // Check if barcode contains only digits
    if (!/^\d+$/.test(cleanBarcode)) {
      return { isValid: false, error: t('scanner.barcodeMustContainOnlyNumbers') };
    }
    
    // Check length for common barcode types
    const length = cleanBarcode.length;
    if (length < 8 || length > 13) {
      return { isValid: false, error: t('scanner.barcodeMustBe8To13Digits') };
    }
    
    // Additional validation for specific barcode types
    if (length === 8) {
      // EAN-8 validation
      return { isValid: true };
    } else if (length === 12) {
      // UPC-A validation
      return { isValid: true };
    } else if (length === 13) {
      // EAN-13 validation
      return { isValid: true };
    }
    
    return { isValid: true };
  };

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
      Alert.alert(t('common.error'), t('scanner.somethingWentWrong'));
    }
  };

  // Handle manual barcode submission
  const handleManualBarcodeSubmit = async () => {
    setBarcodeError('');
    
    const validation = validateBarcode(manualBarcode);
    if (!validation.isValid) {
      setBarcodeError(validation.error || 'Invalid barcode');
      return;
    }

    setScanned(true);
    setBarcodeData(manualBarcode.trim());

    try {
      // Clean the barcode data to make it a valid document ID
      const cleanBarcode = manualBarcode.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
      
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
      Alert.alert(t('common.error'), t('scanner.somethingWentWrong'));
    }
  };

  // Navigation functions
  const handleBackToScanner = () => {
    setCurrentView('scanner');
    setScanned(false);
    setBarcodeData(null);
    setProductState(null);
    setNotFound(false);
    setManualInputMode(false);
    setManualBarcode('');
    setBarcodeError('');
  };

  const handleScanAgain = () => {
    setCurrentView('scanner');
    setScanned(false);
    setBarcodeData(null);
    setProductState(null);
    setNotFound(false);
    setManualInputMode(false);
    setManualBarcode('');
    setBarcodeError('');
  };

  const handleToggleManualInput = () => {
    setManualInputMode(!manualInputMode);
    setManualBarcode('');
    setBarcodeError('');
  };

  const handleReportProduct = () => {
    setCurrentView('productCreation');
  };

  const handleProductCreated = () => {
      Alert.alert(t('common.success'), t('scanner.productAddedToDatabase'));
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
        name: 'Unknown Product',
        notes: 'Quick report from scanner',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      Alert.alert(t('common.success'), `${t('scanner.productReported')} ${state}. ${t('scanner.waitingForAdminApproval')}`);
      setNotFound(false);
    } catch (error) {
      console.error("Error reporting product:", error);
      Alert.alert(t('common.error'), t('scanner.couldNotReportProduct'));
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
      <View style={[scannerScreenStyles.container, screenBottomStyle]}>
        <View style={[scannerScreenStyles.header, overlayHeaderStyle]}>
          <TouchableOpacity style={scannerScreenStyles.backButton} onPress={handleBackToScanner}>
            <Text style={scannerScreenStyles.backButtonText}>← {t('common.back')}</Text>
          </TouchableOpacity>
          <Text style={scannerScreenStyles.headerTitle}>{t('scanner.productNotFound')}</Text>
        </View>
        
        <View style={scannerScreenStyles.permissionContainer}>
          <View style={scannerScreenStyles.resultCard}>
            <Text style={scannerScreenStyles.resultTitle}>{t('scanner.productUnknown')}</Text>
            <Text style={scannerScreenStyles.resultDescription}>
              {t('scanner.productUnknownDescription')}
            </Text>
            
            <View style={scannerScreenStyles.unknownBadge}>
              <Text style={scannerScreenStyles.unknownBadgeText}>{t('scanner.unknownProduct')}</Text>
            </View>
            
            <Text style={scannerScreenStyles.resultDescription}>
              {t('scanner.barcode')}: {barcodeData}
            </Text>
            
            <TouchableOpacity 
              style={scannerScreenStyles.reportButton} 
              onPress={handleReportProduct}
            >
              <Text style={scannerScreenStyles.reportButtonText}>{t('scanner.reportProduct')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={scannerScreenStyles.scanAgainButton} 
              onPress={handleScanAgain}
            >
              <Text style={scannerScreenStyles.scanAgainButtonText}>{t('scanner.scanAgain')}</Text>
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
        onNavigateToLogin={onNavigateToLogin}
      />
    );
  }

  return (
    <KeyboardAvoidingView 
      style={scannerScreenStyles.container}
      behavior="padding"
      keyboardVerticalOffset={0}
    >
      <View
        style={[
          scannerScreenStyles.header,
          overlayHeaderStyle,
          manualInputMode && scannerScreenStyles.manualHeader,
        ]}
      >
        <TouchableOpacity style={scannerScreenStyles.backButton} onPress={onBack}>
          <Text style={scannerScreenStyles.backButtonText}>← {t('common.back')}</Text>
        </TouchableOpacity>
        <Text style={scannerScreenStyles.headerTitle}>{t('scanner.scanProduct')}</Text>
      </View>
      
      {!manualInputMode ? (
        <>
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
              {t('scanner.positionBarcodeInFrame')}
            </Text>
          </View>

          <View style={[scannerScreenStyles.bottomActions, floatingBottomStyle]}>
            <TouchableOpacity 
              style={scannerScreenStyles.toggleButton} 
              onPress={handleToggleManualInput}
            >
              <Text style={scannerScreenStyles.toggleButtonText}>
                {t('scanner.enterManually')}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <ScrollView
          style={scannerScreenStyles.manualInputContainer}
          contentContainerStyle={[
            scannerScreenStyles.manualInputScroll,
            { paddingBottom: insets.bottom + 24 },
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets
        >
          <View style={scannerScreenStyles.manualInputCard}>
            <Text style={scannerScreenStyles.manualInputTitle}>{t('scanner.enterBarcodeManually')}</Text>
            <Text style={scannerScreenStyles.manualInputDescription}>
              {t('scanner.enterBarcodeDescription')}
            </Text>
            
            <View style={scannerScreenStyles.inputContainer}>
              <TextInput
                style={[
                  scannerScreenStyles.barcodeInput,
                  barcodeError ? scannerScreenStyles.barcodeInputError : null
                ]}
                value={manualBarcode}
                onChangeText={(text) => {
                  setManualBarcode(text);
                  setBarcodeError('');
                }}
                placeholder={t('scanner.enterBarcodeNumber')}
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                maxLength={13}
                autoFocus={true}
              />
              {barcodeError ? (
                <Text style={scannerScreenStyles.errorText}>{barcodeError}</Text>
              ) : null}
            </View>
            
            <TouchableOpacity 
              style={scannerScreenStyles.submitButton} 
              onPress={handleManualBarcodeSubmit}
            >
              <Text style={scannerScreenStyles.submitButtonText}>{t('scanner.verifyProduct')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={scannerScreenStyles.manualCameraButton}
              onPress={handleToggleManualInput}
            >
              <Text style={scannerScreenStyles.manualCameraButtonText}>
                {t('scanner.useCamera')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}

