import {
  addDoc,
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  updateDoc,
  where,
  type DocumentData,
  type QueryConstraint,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";

export const REPORTS_PAGE_SIZE = 20;
export type ReportPageCursor = QueryDocumentSnapshot<DocumentData>;

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

const isFailedPrecondition = (error: unknown): boolean =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  (error as { code: string }).code === "failed-precondition";

const toReport = (docSnap: ReportPageCursor): Report =>
  ({
    id: docSnap.id,
    ...docSnap.data(),
  }) as Report;

export const getReportsCount = async (): Promise<number> => {
  try {
    const snapshot = await getCountFromServer(collection(db, "reports"));
    return snapshot.data().count;
  } catch (error) {
    console.error("Error counting reports:", error);
    return 0;
  }
};

export const getPendingReportsCount = async (): Promise<number> => {
  try {
    const q = query(
      collection(db, "reports"),
      where("status", "==", "pending")
    );
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  } catch (error) {
    console.error("Error counting pending reports:", error);
    return 0;
  }
};

const fetchPendingReportBatch = async (
  lastDoc: ReportPageCursor | undefined,
  pageSize: number,
  sortByCreatedAt: boolean
): Promise<{
  docs: ReportPageCursor[];
  lastDoc: ReportPageCursor | null;
  hasMore: boolean;
}> => {
  const constraints: QueryConstraint[] = [where("status", "==", "pending")];
  if (sortByCreatedAt) {
    constraints.push(orderBy("createdAt", "desc"));
  }
  if (lastDoc) {
    constraints.push(startAfter(lastDoc));
  }
  constraints.push(limit(pageSize));
  const querySnapshot = await getDocs(
    query(collection(db, "reports"), ...constraints)
  );
  const docs = querySnapshot.docs;
  return {
    docs,
    lastDoc: docs[docs.length - 1] ?? null,
    hasMore: docs.length === pageSize,
  };
};

export const getPendingReports = async (
  lastDoc?: ReportPageCursor,
  pageSize: number = REPORTS_PAGE_SIZE
): Promise<{
  reports: Report[];
  lastDoc: ReportPageCursor | null;
  hasMore: boolean;
}> => {
  try {
    let batch: Awaited<ReturnType<typeof fetchPendingReportBatch>>;
    try {
      batch = await fetchPendingReportBatch(lastDoc, pageSize, true);
    } catch (error) {
      if (!isFailedPrecondition(error)) {
        throw error;
      }
      batch = await fetchPendingReportBatch(lastDoc, pageSize, false);
    }
    return {
      reports: batch.docs.map(toReport),
      lastDoc: batch.lastDoc,
      hasMore: batch.hasMore,
    };
  } catch (error) {
    console.error("Error getting pending reports:", error);
    throw error;
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
