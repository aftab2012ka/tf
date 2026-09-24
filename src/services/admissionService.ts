import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/firestore';
import { AdmissionApplication } from '../types';
import { sendAdmissionNotification } from './emailService';

const COLLECTION_NAME = 'admissions';

let localDemoAdmissions: AdmissionApplication[] = [
  {
    id: 'demo-adm-1',
    applicationId: 'TF-ADM-2026-10821',
    fullName: 'Mohammad Zaid Patel',
    gender: 'Male',
    age: '19',
    qualification: 'PUC II (Commerce)',
    course: 'Computer Training (Basic to Advanced)',
    address: 'Near Jamia Masjid, Raviwar Peth, Gokak',
    mobile: '9845123456',
    email: 'zaid.patel.demo@gmail.com',
    language: 'English / Urdu',
    message: 'Interested in MS Office and computer literacy course.',
    status: 'New',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'demo-adm-2',
    applicationId: 'TF-ADM-2026-10749',
    fullName: 'Fatima Bi Inamdar',
    gender: 'Female',
    age: '22',
    qualification: 'BA Graduate',
    course: 'Tailoring & Stitching',
    address: 'Main Road, Shivaji Nagar, Gokak',
    mobile: '9880987654',
    email: 'fatima.inamdar.demo@gmail.com',
    language: 'Urdu / Kannada',
    message: 'Looking to start self-employment tailoring.',
    status: 'Reviewing',
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'demo-adm-3',
    applicationId: 'TF-ADM-2026-10612',
    fullName: 'Ayesha Banu Kazi',
    gender: 'Female',
    age: '20',
    qualification: '10th Standard',
    course: 'Mehndi / Beauty & Wellness Modules',
    address: 'Islampur Galli, Gokak',
    mobile: '9448112233',
    email: 'ayesha.kazi.demo@gmail.com',
    language: 'Urdu',
    message: 'Wish to learn bridal mehndi artistry.',
    status: 'Approved',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 36).toISOString(),
  }
];

export function generateApplicationId(): string {
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const year = new Date().getFullYear();
  return `TF-ADM-${year}-${randomSuffix}`;
}

export async function submitAdmission(
  data: Omit<AdmissionApplication, 'id' | 'applicationId' | 'status' | 'createdAt' | 'updatedAt'>
): Promise<{ id: string; applicationId: string }> {
  const applicationId = generateApplicationId();
  const now = new Date().toISOString();
  const docRef = doc(collection(db, COLLECTION_NAME));

  const applicationPayload: Omit<AdmissionApplication, 'id'> = {
    ...data,
    applicationId,
    status: 'New',
    createdAt: now,
    updatedAt: now
  };

  try {
    await setDoc(docRef, applicationPayload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${COLLECTION_NAME}/${docRef.id}`);
  }

  // Dispatch email notification in background (non-blocking)
  sendAdmissionNotification({ ...applicationPayload, id: docRef.id }).catch((err) => {
    console.warn('Email notification dispatch notice:', err);
  });

  return { id: docRef.id, applicationId };
}

export async function getAdmissions(): Promise<AdmissionApplication[]> {
  if (!auth.currentUser) {
    return [...localDemoAdmissions];
  }
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<AdmissionApplication, 'id'>)
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
  }
}

export async function getAdmissionById(id: string): Promise<AdmissionApplication | null> {
  if (!auth.currentUser) {
    return localDemoAdmissions.find((a) => a.id === id) || null;
  }
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return { id: snap.id, ...(snap.data() as Omit<AdmissionApplication, 'id'>) };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${COLLECTION_NAME}/${id}`);
  }
}

export async function updateAdmissionStatus(
  id: string,
  status: AdmissionApplication['status']
): Promise<void> {
  if (!auth.currentUser) {
    localDemoAdmissions = localDemoAdmissions.map((a) =>
      a.id === id ? { ...a, status, updatedAt: new Date().toISOString() } : a
    );
    return;
  }
  const docRef = doc(db, COLLECTION_NAME, id);
  try {
    await updateDoc(docRef, {
      status,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${id}`);
  }
}

export async function updateAdmission(
  id: string,
  data: Partial<AdmissionApplication>
): Promise<void> {
  if (!auth.currentUser) {
    localDemoAdmissions = localDemoAdmissions.map((a) =>
      a.id === id ? { ...a, ...data, updatedAt: new Date().toISOString() } : a
    );
    return;
  }
  const docRef = doc(db, COLLECTION_NAME, id);
  try {
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${id}`);
  }
}

export async function deleteAdmission(id: string): Promise<void> {
  if (!auth.currentUser) {
    localDemoAdmissions = localDemoAdmissions.filter((a) => a.id !== id);
    return;
  }
  const docRef = doc(db, COLLECTION_NAME, id);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${id}`);
  }
}
