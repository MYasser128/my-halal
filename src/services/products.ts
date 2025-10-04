import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit,
  startAfter,
  where
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Product {
  id: string;
  barcode: string;
  name: string;
  halalStates: {
    default: 'halal' | 'haram' | 'unknown';
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
  lastUpdated?: any;
  createdAt?: any;
  createdBy?: string;
  createdByAdmin?: string;
  status?: string;
  verificationHistory?: Array<{
    adminId: string;
    action: string;
    notes: string;
    timestamp: any;
  }>;
}

export interface ProductUpdateData {
  name?: string;
  halalStates?: {
    default: 'halal' | 'haram' | 'unknown';
  };
  ingredients?: string[];
  manufacturer?: string;
  category?: string;
  description?: string;
  lastUpdated?: any;
}

// Get all products with pagination
export const getAllProducts = async (lastDoc?: any, pageSize: number = 20): Promise<{
  products: Product[];
  lastDoc: any;
  hasMore: boolean;
}> => {
  try {
    let q = query(
      collection(db, 'products'),
      orderBy('lastUpdated', 'desc'),
      limit(pageSize)
    );

    if (lastDoc) {
      q = query(
        collection(db, 'products'),
        orderBy('lastUpdated', 'desc'),
        startAfter(lastDoc),
        limit(pageSize)
      );
    }

    const querySnapshot = await getDocs(q);
    const products: Product[] = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];

    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    const hasMore = querySnapshot.docs.length === pageSize;

    return {
      products,
      lastDoc: lastVisible,
      hasMore
    };
  } catch (error) {
    console.error('Error getting products:', error);
    return {
      products: [],
      lastDoc: null,
      hasMore: false
    };
  }
};

// Get a single product by ID
export const getProduct = async (productId: string): Promise<Product | null> => {
  try {
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);
    
    if (productSnap.exists()) {
      return {
        id: productSnap.id,
        ...productSnap.data()
      } as Product;
    }
    return null;
  } catch (error) {
    console.error('Error getting product:', error);
    return null;
  }
};

// Update a product
export const updateProduct = async (
  productId: string, 
  updateData: ProductUpdateData,
  adminId: string
): Promise<boolean> => {
  try {
    const productRef = doc(db, 'products', productId);
    
    // Add verification history entry
    const productDoc = await getDoc(productRef);
    if (!productDoc.exists()) {
      throw new Error('Product not found');
    }

    const currentProduct = productDoc.data() as Product;
    const verificationHistory = currentProduct.verificationHistory || [];
    
    verificationHistory.push({
      adminId: adminId,
      action: 'updated',
      notes: 'Product details updated by admin',
      timestamp: new Date()
    });

    const updatePayload = {
      ...updateData,
      lastUpdated: new Date(),
      verificationHistory
    };

    await updateDoc(productRef, updatePayload);
    return true;
  } catch (error) {
    console.error('Error updating product:', error);
    return false;
  }
};

// Delete a product
export const deleteProduct = async (productId: string): Promise<boolean> => {
  try {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};

// Search products by name or barcode
export const searchProducts = async (searchTerm: string): Promise<Product[]> => {
  try {
    // Get all products and filter client-side for now
    // In a production app, you might want to use Algolia or similar for better search
    const { products } = await getAllProducts();
    
    const filteredProducts = products.filter(product => 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode?.includes(searchTerm)
    );
    
    return filteredProducts;
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
};
