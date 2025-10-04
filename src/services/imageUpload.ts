import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export interface ImageUploadProgress {
  progress: number;
  completed: boolean;
  error?: string;
}

// Request permissions for image picker
export const requestImagePermissions = async (): Promise<boolean> => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting image permissions:', error);
    return false;
  };
};

// Pick image from gallery or camera
export const pickImage = async (): Promise<ImagePicker.ImagePickerResult> => {
  try {
    const hasPermission = await requestImagePermissions();
    if (!hasPermission) {
      throw new Error('Permission to access media library was denied');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    return result;
  } catch (error) {
    console.error('Error picking image:', error);
    throw error;
  }
};

// Take photo with camera
export const takePhoto = async (): Promise<ImagePicker.ImagePickerResult> => {
  try {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission to access camera was denied');
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    return result;
  } catch (error) {
    console.error('Error taking photo:', error);
    throw error;
  }
};

// Compress and resize image
export const compressImage = async (uri: string): Promise<string> => {
  try {
    const manipulatedImage = await manipulateAsync(
      uri,
      [
        {
          resize: {
            width: 800, // Max width
            height: 600, // Max height
          },
        },
      ],
      {
        compress: 0.7, // 70% quality
        format: SaveFormat.JPEG,
      }
    );

    return manipulatedImage.uri;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw error;
  }
};

// Upload image to Firebase Storage
export const uploadImageToStorage = async (
  imageUri: string,
  productId: string,
  onProgress?: (progress: number) => void
): Promise<ImageUploadResult> => {
  try {
    // Compress the image first
    const compressedUri = await compressImage(imageUri);

    // Create a reference to the file in Firebase Storage
    const timestamp = Date.now();
    const fileName = `products/${productId}/image_${timestamp}.jpg`;
    const storageRef = ref(storage, fileName);

    // Convert URI to blob
    const response = await fetch(compressedUri);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    const blob = await response.blob();

    // Upload the file
    const uploadTask = uploadBytes(storageRef, blob);
    
    // Note: uploadBytes doesn't provide progress tracking directly
    // For progress tracking, you would need to use uploadBytesResumable
    // but that requires a different approach with React Native
    await uploadTask;

    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);

    return {
      success: true,
      url: downloadURL,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    
    // More detailed error handling
    let errorMessage = 'Unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
      if (error.message.includes('storage/unauthorized')) {
        errorMessage = 'Permission denied. Please check Firebase Storage rules.';
      } else if (error.message.includes('storage/object-not-found')) {
        errorMessage = 'File not found.';
      } else if (error.message.includes('storage/quota-exceeded')) {
        errorMessage = 'Storage quota exceeded.';
      } else if (error.message.includes('storage/unauthenticated')) {
        errorMessage = 'User not authenticated.';
      }
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
};

// Upload multiple images
export const uploadMultipleImages = async (
  imageUris: string[],
  productId: string,
  onProgress?: (progress: number) => void
): Promise<ImageUploadResult[]> => {
  try {
    const results: ImageUploadResult[] = [];
    
    for (let i = 0; i < imageUris.length; i++) {
      const result = await uploadImageToStorage(imageUris[i], productId);
      results.push(result);
      
      // Calculate overall progress
      if (onProgress) {
        const progress = ((i + 1) / imageUris.length) * 100;
        onProgress(progress);
      }
    }

    return results;
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    return imageUris.map(() => ({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }));
  }
};

// Delete image from Firebase Storage
export const deleteImageFromStorage = async (imageUrl: string): Promise<boolean> => {
  try {
    // Extract the file path from the URL
    const url = new URL(imageUrl);
    const path = decodeURIComponent(url.pathname.split('/o/')[1]?.split('?')[0] || '');
    
    if (!path) {
      throw new Error('Invalid image URL');
    }

    const imageRef = ref(storage, path);
    await deleteObject(imageRef);
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};

// Delete multiple images
export const deleteMultipleImages = async (imageUrls: string[]): Promise<boolean[]> => {
  try {
    const results = await Promise.all(
      imageUrls.map(url => deleteImageFromStorage(url))
    );
    return results;
  } catch (error) {
    console.error('Error deleting multiple images:', error);
    return imageUrls.map(() => false);
  }
};
