import { initializeApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot,
  getDocs,
  orderBy,
  deleteDoc,
  doc
} from 'firebase/firestore';
import localFirebaseConfig from '../firebase-applet-config.json';
import { FraudFeedback } from './types';
import { normalizePhone } from './utils/phoneUtils';

// Guaranteed fallback config for Vercel/Production deployment
const defaultFirebaseConfig = {
  projectId: "clever-gasket-p07pf",
  appId: "1:875868521416:web:79032f3720a75516f236fd",
  apiKey: "AIzaSyCflurfA4KOGs9zaiHAauXhWVl8jTGZQFI",
  authDomain: "clever-gasket-p07pf.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-2e84e0c7-4d08-4458-8a95-2139cecbb531",
  storageBucket: "clever-gasket-p07pf.firebasestorage.app",
  messagingSenderId: "875868521416"
};

const activeConfig = localFirebaseConfig || defaultFirebaseConfig;

// Initialize Firebase App safely
export const app = getApps().length === 0 ? initializeApp(activeConfig) : getApps()[0];

// Initialize Firestore with configured database ID
export const db = getFirestore(app, activeConfig.firestoreDatabaseId || 'ai-studio-2e84e0c7-4d08-4458-8a95-2139cecbb531');

const COLLECTION_NAME = 'fraud_reports';

/**
 * Save new fraud report to Firestore
 */
export async function saveReportToFirestore(
  newReport: Omit<FraudFeedback, 'id' | 'createdAt'>
): Promise<FraudFeedback> {
  const normalizedPhone = normalizePhone(newReport.customerPhone);
  const now = new Date().toISOString();

  const dataToSave = {
    customerPhone: normalizedPhone,
    customerName: newReport.customerName || '',
    sellerShopName: newReport.sellerShopName || '',
    sellerPlatform: newReport.sellerPlatform || 'facebook',
    isVerifiedSeller: !!newReport.isVerifiedSeller,
    category: newReport.category || 'refused_delivery',
    lossAmount: Number(newReport.lossAmount) || 0,
    courierService: newReport.courierService || '',
    feedbackText: newReport.feedbackText || '',
    location: newReport.location || '',
    orderNumber: newReport.orderNumber || '',
    createdAt: now,
  };

  const docRef = await addDoc(collection(db, COLLECTION_NAME), dataToSave);

  return {
    ...dataToSave,
    id: docRef.id,
  };
}

/**
 * Real-time listener for reports matching a specific customer phone number
 */
export function subscribeToCustomerReports(
  phone: string,
  onUpdate: (reports: FraudFeedback[]) => void,
  onError?: (err: Error) => void
) {
  const normalizedPhone = normalizePhone(phone);
  if (!normalizedPhone) {
    onUpdate([]);
    return () => {};
  }

  const reportsRef = collection(db, COLLECTION_NAME);
  const q = query(
    reportsRef,
    where('customerPhone', '==', normalizedPhone)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const reports: FraudFeedback[] = [];
      snapshot.forEach((doc) => {
        const d = doc.data();
        reports.push({
          id: doc.id,
          customerPhone: d.customerPhone,
          customerName: d.customerName || '',
          sellerShopName: d.sellerShopName || '',
          sellerPlatform: d.sellerPlatform || 'facebook',
          isVerifiedSeller: d.isVerifiedSeller ?? true,
          category: d.category || 'refused_delivery',
          lossAmount: Number(d.lossAmount) || 0,
          courierService: d.courierService || '',
          feedbackText: d.feedbackText || '',
          location: d.location || '',
          orderNumber: d.orderNumber || '',
          createdAt: d.createdAt || new Date().toISOString(),
        });
      });

      // Sort newest first
      reports.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      onUpdate(reports);
    },
    (err) => {
      console.error('Firestore listener error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Real-time listener for ALL fraud reports (for Admin Dashboard)
 */
export function subscribeAllReports(
  onUpdate: (reports: FraudFeedback[]) => void,
  onError?: (err: Error) => void
) {
  const reportsRef = collection(db, COLLECTION_NAME);

  return onSnapshot(
    reportsRef,
    (snapshot) => {
      const reports: FraudFeedback[] = [];
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        reports.push({
          id: docSnap.id,
          customerPhone: d.customerPhone || '',
          customerName: d.customerName || '',
          sellerShopName: d.sellerShopName || '',
          sellerPlatform: d.sellerPlatform || 'facebook',
          isVerifiedSeller: d.isVerifiedSeller ?? true,
          category: d.category || 'refused_delivery',
          lossAmount: Number(d.lossAmount) || 0,
          courierService: d.courierService || '',
          feedbackText: d.feedbackText || '',
          location: d.location || '',
          orderNumber: d.orderNumber || '',
          createdAt: d.createdAt || new Date().toISOString(),
        });
      });

      // Sort newest first
      reports.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      onUpdate(reports);
    },
    (err) => {
      console.error('Firestore all reports listener error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Delete a report from Firestore (Admin action)
 */
export async function deleteReportFromFirestore(reportId: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, reportId);
  await deleteDoc(docRef);
}
