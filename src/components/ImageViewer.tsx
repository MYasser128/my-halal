import React from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaPadding } from "../hooks/useSafeAreaPadding";
import { colors } from "../styles/theme";
import { ZoomableImage } from "./ZoomableImage";

interface ImageViewerProps {
  visible: boolean;
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onIndexChange?: (index: number) => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export const ImageViewer: React.FC<ImageViewerProps> = ({
  visible,
  images,
  currentIndex,
  onClose,
  onIndexChange,
}) => {
  const { headerStyle, screenBottomStyle } = useSafeAreaPadding();
  const imageUrl = images[currentIndex];

  const handlePrevious = () => {
    if (onIndexChange && currentIndex > 0) {
      onIndexChange(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (onIndexChange && currentIndex < images.length - 1) {
      onIndexChange(currentIndex + 1);
    }
  };

  if (!visible || images.length === 0 || !imageUrl) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.container, screenBottomStyle]}>
        <View style={[styles.header, headerStyle]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.imageCounter}>
            {currentIndex + 1} / {images.length}
          </Text>
        </View>

        <View style={styles.imageContainer}>
          <ZoomableImage
            key={`${currentIndex}-${imageUrl}`}
            uri={imageUrl}
            style={styles.image}
          />
        </View>

        {images.length > 1 && (
          <View style={styles.navigation}>
            <TouchableOpacity
              style={[
                styles.navButton,
                currentIndex === 0 && styles.navButtonDisabled,
              ]}
              onPress={handlePrevious}
              disabled={currentIndex === 0}
            >
              <Text style={styles.navButtonText}>‹</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.navButton,
                currentIndex === images.length - 1 && styles.navButtonDisabled,
              ]}
              onPress={handleNext}
              disabled={currentIndex === images.length - 1}
            >
              <Text style={styles.navButtonText}>›</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: colors.text.inverse,
    fontSize: 20,
    fontWeight: "bold",
  },
  imageCounter: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: "500",
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    width: screenWidth,
    height: screenHeight - 120,
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  navButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navButtonText: {
    color: colors.text.inverse,
    fontSize: 24,
    fontWeight: "bold",
  },
});
