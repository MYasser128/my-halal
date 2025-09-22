import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export const approveReport = async (reportId: string, adminUid: string) => {
  await updateDoc(doc(db, 'reports', reportId), { status: 'approved', reviewedBy: adminUid, reviewedAt: serverTimestamp() });
};
