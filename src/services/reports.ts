import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

export interface Report {
  id: string;
  barcode: string;
  name: string;
  status: "pending" | "approved" | "rejected";
  suggestedState: "halal" | "haram" | "unknown";
  notes?: string;
  reporterId?: string;
  reporterEmail?: string;
  reviewedBy?: string;
  images?: string[];
  createdAt: any;
  updatedAt: any;
}

export interface Product {
  id: string;
  barcode: string;
  name: string;
  lastUpdated: any;
  createdByAdmin?: string;
  verificationHistory: Array<{
    adminId: string;
    action: string;
    notes: string;
    timestamp: any;
  }>;
  halalStates: {
    default: string;
  };
  images?: string[];
}

// Get all pending reports
export const getPendingReports = async (): Promise<Report[]> => {
  try {
    const reportsRef = collection(db, "reports");
    const q = query(reportsRef, where("status", "==", "pending"));
    const querySnapshot = await getDocs(q);

    const reports = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Report)
    );

    // Sort by createdAt in JavaScript instead of Firestore
    return reports.sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return b.createdAt.toMillis() - a.createdAt.toMillis();
      }
      return 0;
    });
  } catch (error) {
    console.error("Error getting pending reports:", error);
    return [];
  }
};

// Approve a report
export const approveReport = async (
  reportId: string,
  adminId: string,
  notes?: string
): Promise<boolean> => {
  try {
    const reportRef = doc(db, "reports", reportId);
    const reportDoc = await getDoc(reportRef);

    if (!reportDoc.exists()) {
      throw new Error("Report not found");
    }

    const reportData = reportDoc.data() as Report;

    // Update report status
    await updateDoc(reportRef, {
      status: "approved",
      reviewedBy: adminId,
      notes: notes || "",
      updatedAt: serverTimestamp(),
    });

    // Update or create product
    const barcode = reportData.barcode || `manual-${reportId}`;
    const productRef = doc(db, "products", barcode);

    const productData: Partial<Product> = {
      barcode,
      name: reportData.name || undefined,
      lastUpdated: serverTimestamp(),
      createdByAdmin: adminId,
      verificationHistory: [
        {
          adminId: adminId,
          action: "approved",
          notes: notes || "",
          timestamp: new Date(),
        },
      ],
      halalStates: {
        default: reportData.suggestedState || "unknown",
      },
      images: reportData.images || undefined,
    };

    // Use set with merge to create or update
    await setDoc(productRef, productData, { merge: true });

    return true;
  } catch (error) {
    console.error("Error approving report:", error);
    return false;
  }
};

// Reject a report
export const rejectReport = async (
  reportId: string,
  adminId: string,
  notes?: string
): Promise<boolean> => {
  try {
    const reportRef = doc(db, "reports", reportId);

    await updateDoc(reportRef, {
      status: "rejected",
      reviewedBy: adminId,
      notes: notes || "",
      updatedAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error("Error rejecting report:", error);
    return false;
  }
};

// Submit a new report
export const submitReport = async (
  reportData: Omit<Report, "id" | "status" | "createdAt" | "updatedAt">
): Promise<string | null> => {
  try {
    const reportsRef = collection(db, "reports");
    const docRef = await addDoc(reportsRef, {
      ...reportData,
      status: "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error submitting report:", error);
    return null;
  }
};

// Get all reports (for admin)
export const getAllReports = async (): Promise<Report[]> => {
  try {
    const reportsRef = collection(db, "reports");
    const querySnapshot = await getDocs(reportsRef);

    const reports = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Report)
    );

    // Sort by createdAt in JavaScript instead of Firestore
    return reports.sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return b.createdAt.toMillis() - a.createdAt.toMillis();
      }
      return 0;
    });
  } catch (error) {
    console.error("Error getting all reports:", error);
    return [];
  }
};
