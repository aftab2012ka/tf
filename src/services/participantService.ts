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
import { SeeratParticipant } from '../types';
import { sendParticipantConfirmation } from './emailService';

const COLLECTION_NAME = 'seeratParticipants';

let localDemoParticipants: SeeratParticipant[] = [
  {
    id: 'demo-srt-1',
    registrationId: 'TF-SRT-2026-50142',
    fullName: 'Abdul Rahman Mulla',
    gender: 'Male',
    age: '21',
    qualification: 'B.Sc 2nd Year',
    study: 'Degree College, Gokak',
    marriageStatus: 'Unmarried',
    address: 'Near Old Bus Stand, Gokak',
    mobile: '9740112244',
    language: 'Urdu',
    paymentMode: 'UPI',
    paymentReference: 'UPI-982348123',
    status: 'Confirmed',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: 'demo-srt-2',
    registrationId: 'TF-SRT-2026-50119',
    fullName: 'Mariyam Begum Shaikh',
    gender: 'Female',
    age: '18',
    qualification: 'PUC I',
    study: 'Government PU College',
    marriageStatus: 'Unmarried',
    address: 'Darbar Galli, Gokak',
    mobile: '9986554433',
    language: 'Urdu',
    paymentMode: 'Cash',
    status: 'Registered',
    createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 30).toISOString(),
  }
];

export function generateRegistrationId(): string {
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const year = new Date().getFullYear();
  return `TF-SRT-${year}-${randomSuffix}`;
}

export async function registerParticipant(
  data: Omit<SeeratParticipant, 'id' | 'registrationId' | 'status' | 'createdAt' | 'updatedAt'>
): Promise<{ id: string; registrationId: string }> {
  const registrationId = generateRegistrationId();
  const now = new Date().toISOString();
  const docRef = doc(collection(db, COLLECTION_NAME));

  const participantPayload: Omit<SeeratParticipant, 'id'> = {
    ...data,
    registrationId,
    status: 'Registered',
    createdAt: now,
    updatedAt: now
  };

  try {
    await setDoc(docRef, participantPayload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${COLLECTION_NAME}/${docRef.id}`);
  }

  // Non-blocking notification
  sendParticipantConfirmation({ ...participantPayload, id: docRef.id }).catch((err) => {
    console.warn('Participant confirmation notice:', err);
  });

  return { id: docRef.id, registrationId };
}

export async function getParticipants(): Promise<SeeratParticipant[]> {
  if (!auth.currentUser) {
    return [...localDemoParticipants];
  }
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<SeeratParticipant, 'id'>)
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
  }
}

export async function getParticipantById(id: string): Promise<SeeratParticipant | null> {
  if (!auth.currentUser) {
    return localDemoParticipants.find((p) => p.id === id) || null;
  }
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return { id: snap.id, ...(snap.data() as Omit<SeeratParticipant, 'id'>) };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${COLLECTION_NAME}/${id}`);
  }
}

export async function updateParticipantStatus(
  id: string,
  status: SeeratParticipant['status']
): Promise<void> {
  if (!auth.currentUser) {
    localDemoParticipants = localDemoParticipants.map((p) =>
      p.id === id ? { ...p, status, updatedAt: new Date().toISOString() } : p
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

export async function updateParticipant(
  id: string,
  data: Partial<SeeratParticipant>
): Promise<void> {
  if (!auth.currentUser) {
    localDemoParticipants = localDemoParticipants.map((p) =>
      p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
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

export async function deleteParticipant(id: string): Promise<void> {
  if (!auth.currentUser) {
    localDemoParticipants = localDemoParticipants.filter((p) => p.id !== id);
    return;
  }
  const docRef = doc(db, COLLECTION_NAME, id);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${id}`);
  }
}
