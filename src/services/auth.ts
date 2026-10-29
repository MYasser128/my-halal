import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User
} from "firebase/auth";
import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
  updateDoc,
  type DocumentData,
  type QueryConstraint,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { auth, db } from "../firebase";

export const USERS_PAGE_SIZE = 20;
export type UserPageCursor = QueryDocumentSnapshot<DocumentData>;

export interface AdminUserListItem {
  id: string;
  email?: string;
  displayName?: string;
  isAdmin?: boolean;
}

export type AppUser = User & {
  isAdmin: boolean;
  receiveUpdates: boolean;
};

export type ProfileExtras = {
  displayName?: string;
  receiveUpdates?: boolean;
};

let cachedProfile: AppUser | null = null;
let inFlightProfile: { uid: string; promise: Promise<AppUser> } | null = null;
let pendingProfileExtras: ProfileExtras | undefined;

export const userIsAdmin = (user: User | AppUser | null | undefined): boolean =>
  Boolean(user && (user as AppUser).isAdmin === true);

export const clearUserProfileCache = () => {
  cachedProfile = null;
  inFlightProfile = null;
  pendingProfileExtras = undefined;
};

export const setPendingProfileExtras = (extras: ProfileExtras) => {
  pendingProfileExtras = extras;
};

const toAppUser = (user: User, data?: DocumentData | null): AppUser =>
  ({
    ...user,
    displayName:
      data?.displayName ||
      user.displayName ||
      user.email?.split("@")[0] ||
      "User",
    email: data?.email || user.email || "",
    isAdmin: data?.isAdmin === true,
    receiveUpdates: data?.receiveUpdates === true,
  }) as AppUser;

const loadUserProfile = async (
  user: User,
  additionalData: ProfileExtras
): Promise<AppUser> => {
  const extras = { ...pendingProfileExtras, ...additionalData };
  pendingProfileExtras = undefined;

  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const payload = {
        displayName: extras.displayName || user.displayName || "",
        email: user.email || "",
        createdAt: new Date(),
        isAdmin: false,
        lastLoginAt: new Date(),
        receiveUpdates: extras.receiveUpdates === true,
      };
      await setDoc(userRef, payload);
      return toAppUser(user, payload);
    }

    await updateDoc(userRef, {
      lastLoginAt: new Date(),
    });
    return toAppUser(user, userSnap.data());
  } catch (error) {
    console.error("Error loading user profile:", error);
    return toAppUser(user, extras);
  }
};

export const ensureUserProfile = async (
  user: User,
  additionalData: ProfileExtras = {}
): Promise<AppUser> => {
  if (
    additionalData.displayName !== undefined ||
    additionalData.receiveUpdates !== undefined
  ) {
    pendingProfileExtras = { ...pendingProfileExtras, ...additionalData };
  }
  if (cachedProfile?.uid === user.uid) {
    pendingProfileExtras = undefined;
    return cachedProfile;
  }
  if (inFlightProfile?.uid === user.uid) {
    return inFlightProfile.promise;
  }

  const promise = loadUserProfile(user, additionalData);
  inFlightProfile = { uid: user.uid, promise };
  try {
    cachedProfile = await promise;
    return cachedProfile;
  } finally {
    if (inFlightProfile?.promise === promise) {
      inFlightProfile = null;
    }
  }
};

export const register = (email: string, pass: string) => createUserWithEmailAndPassword(auth, email, pass);
export const login = (email: string, pass: string) => signInWithEmailAndPassword(auth, email, pass);
export const logout = async () => {
  clearUserProfileCache();
  return signOut(auth);
};

export const setAdminStatus = async (userId: string, isAdmin: boolean): Promise<boolean> => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      isAdmin: isAdmin,
      lastUpdated: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error setting admin status:', error);
    return false;
  }
};

export const getUsersCount = async (): Promise<number> => {
  try {
    const snapshot = await getCountFromServer(collection(db, "users"));
    return snapshot.data().count;
  } catch (error) {
    console.error("Error counting users:", error);
    return 0;
  }
};

export const getUsers = async (
  lastDoc?: UserPageCursor,
  pageSize: number = USERS_PAGE_SIZE
): Promise<{
  users: AdminUserListItem[];
  lastDoc: UserPageCursor | null;
  hasMore: boolean;
}> => {
  try {
    const constraints: QueryConstraint[] = [orderBy("email")];
    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }
    constraints.push(limit(pageSize));
    const querySnapshot = await getDocs(
      query(collection(db, "users"), ...constraints)
    );
    const docs = querySnapshot.docs;
    return {
      users: docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })),
      lastDoc: docs[docs.length - 1] ?? null,
      hasMore: docs.length === pageSize,
    };
  } catch (error) {
    console.error("Error getting users:", error);
    throw error;
  }
};

// Auth state listener
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
