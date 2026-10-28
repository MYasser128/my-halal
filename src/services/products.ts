import {
  collection,
  deleteDoc,
  doc,
  endAt,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
  startAt,
  updateDoc,
  where,
  writeBatch,
  type DocumentData,
  type QueryConstraint,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";

export const PRODUCTS_PAGE_SIZE = 20;
export type ProductPageCursor = QueryDocumentSnapshot<DocumentData>;
export type ProductListFilter = "all" | "halal";

export interface Product {
  id: string;
  barcode: string;
  name: string;
  halalStates: {
    default: "halal" | "haram" | "suspicious" | "unknown";
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
  images?: string[]; // Array of Firebase Storage URLs
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
    default: "halal" | "haram" | "suspicious" | "unknown";
  };
  ingredients?: string[];
  manufacturer?: string;
  category?: string;
  description?: string;
  images?: string[]; // Array of Firebase Storage URLs
  lastUpdated?: any;
  barcode?: string;
}

export class ProductBarcodeExistsError extends Error {
  constructor() {
    super("BARCODE_EXISTS");
    this.name = "ProductBarcodeExistsError";
  }
}

export const toProductDocId = (barcode: string): string =>
  barcode.trim().replace(/[^a-zA-Z0-9_-]/g, "_");

export const getProductsCount = async (): Promise<number> => {
  try {
    const snapshot = await getCountFromServer(collection(db, "products"));
    return snapshot.data().count;
  } catch (error) {
    console.error("Error counting products:", error);
    return 0;
  }
};

export const getHalalProductsCount = async (): Promise<number> => {
  try {
    const q = query(
      collection(db, "products"),
      where("halalStates.default", "==", "halal")
    );
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  } catch (error) {
    console.error("Error counting halal products:", error);
    return 0;
  }
};

const fetchProductBatch = async (
  lastDoc: ProductPageCursor | undefined,
  pageSize: number,
  statusFilter: ProductListFilter = "all"
): Promise<{
  docs: ProductPageCursor[];
  lastDoc: ProductPageCursor | null;
  hasMore: boolean;
}> => {
  const constraints: QueryConstraint[] = [];
  if (statusFilter === "halal") {
    // Equality + orderBy on the same field uses the automatic single-field
    // index, so we get a full page of matching products without a composite.
    constraints.push(where("halalStates.default", "==", "halal"));
    constraints.push(orderBy("halalStates.default"));
  } else {
    constraints.push(orderBy("lastUpdated", "desc"));
  }
  if (lastDoc) {
    constraints.push(startAfter(lastDoc));
  }
  constraints.push(limit(pageSize));
  const querySnapshot = await getDocs(
    query(collection(db, "products"), ...constraints)
  );
  const docs = querySnapshot.docs;
  return {
    docs,
    lastDoc: docs[docs.length - 1] ?? null,
    hasMore: docs.length === pageSize,
  };
};

const toListedProduct = (docSnap: ProductPageCursor): Product =>
  ({
    id: docSnap.id,
    ...docSnap.data(),
  }) as Product;

export const getAllProducts = async (
  lastDoc?: ProductPageCursor,
  pageSize: number = PRODUCTS_PAGE_SIZE,
  statusFilter: ProductListFilter = "all"
): Promise<{
  products: Product[];
  lastDoc: ProductPageCursor | null;
  hasMore: boolean;
}> => {
  try {
    const batch = await fetchProductBatch(lastDoc, pageSize, statusFilter);
    return {
      products: batch.docs.map(toListedProduct),
      lastDoc: batch.lastDoc,
      hasMore: batch.hasMore,
    };
  } catch (error) {
    console.error("Error getting products:", error);
    throw error;
  }
};

// Get a single product by ID
export const getProduct = async (
  productId: string
): Promise<Product | null> => {
  try {
    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);

    if (productSnap.exists()) {
      return {
        id: productSnap.id,
        ...productSnap.data(),
      } as Product;
    }
    return null;
  } catch (error) {
    console.error("Error getting product:", error);
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
    const productRef = doc(db, "products", productId);

    // Add verification history entry
    const productDoc = await getDoc(productRef);
    if (!productDoc.exists()) {
      throw new Error("Product not found");
    }

    const currentProduct = productDoc.data() as Product;
    const verificationHistory = currentProduct.verificationHistory || [];

    verificationHistory.push({
      adminId: adminId,
      action: "updated",
      notes: "Product details updated by admin",
      timestamp: new Date(),
    });

    const nextBarcode = (updateData.barcode || currentProduct.barcode || productId).trim();
    const nextId = toProductDocId(nextBarcode);
    const updatePayload = {
      ...updateData,
      barcode: nextBarcode,
      lastUpdated: new Date(),
      verificationHistory,
    };

    if (nextId !== productId) {
      const nextRef = doc(db, "products", nextId);
      const nextSnap = await getDoc(nextRef);
      if (nextSnap.exists()) {
        throw new ProductBarcodeExistsError();
      }

      const batch = writeBatch(db);
      batch.set(nextRef, {
        ...currentProduct,
        ...updatePayload,
      });
      batch.delete(productRef);
      await batch.commit();
      return true;
    }

    await updateDoc(productRef, updatePayload);
    return true;
  } catch (error) {
    if (error instanceof ProductBarcodeExistsError) {
      throw error;
    }
    console.error("Error updating product:", error);
    return false;
  }
};

// Delete a product
export const deleteProduct = async (productId: string): Promise<boolean> => {
  try {
    const productRef = doc(db, "products", productId);
    await deleteDoc(productRef);
    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    return false;
  }
};

const toProduct = (
  id: string,
  data: DocumentData
): Product => ({ id, ...data }) as Product;

// Search products by barcode (exact) or name prefix
export const searchProducts = async (
  searchTerm: string
): Promise<Product[]> => {
  const term = searchTerm.trim();
  if (!term) return [];

  const found = new Map<string, Product>();
  const add = (product: Product | null) => {
    if (product) found.set(product.id, product);
  };

  try {
    add(await getProduct(term));
    const compact = term.replace(/\s+/g, "");
    if (compact !== term) {
      add(await getProduct(compact));
    }

    const barcodeSnap = await getDocs(
      query(collection(db, "products"), where("barcode", "==", term), limit(5))
    );
    barcodeSnap.docs.forEach((docSnap) =>
      add(toProduct(docSnap.id, docSnap.data()))
    );

    const nameSnap = await getDocs(
      query(
        collection(db, "products"),
        orderBy("name"),
        startAt(term),
        endAt(`${term}\uf8ff`),
        limit(PRODUCTS_PAGE_SIZE)
      )
    );
    nameSnap.docs.forEach((docSnap) =>
      add(toProduct(docSnap.id, docSnap.data()))
    );

    return Array.from(found.values());
  } catch (error) {
    console.error("Error searching products:", error);
    return Array.from(found.values());
  }
};
