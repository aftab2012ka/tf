import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/firestore';
import { GalleryItem } from '../types';

const COLLECTION_NAME = 'gallery';

export const INITIAL_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    mediaType: 'photo',
    title: 'Computer Lab Practical Training Session',
    caption: 'Students practicing digital literacy, MS Office, and vocational computer skills at the Tuba Foundation learning center in Gokak.',
    category: 'Computer Classes',
    mediaUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1000&auto=format&fit=crop&q=80',
    published: true,
    date: '2026-08-15',
    createdAt: '2026-08-15T10:00:00.000Z',
    updatedAt: '2026-08-15T10:00:00.000Z',
  },
  {
    id: 'gal-2',
    mediaType: 'photo',
    title: 'Women Vocational Tailoring & Stitching Workshop',
    caption: 'Hands-on garment construction, cutting, and stitching practical training helping women build self-reliant livelihoods.',
    category: 'Tailoring',
    mediaUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1000&auto=format&fit=crop&q=80',
    published: true,
    date: '2026-08-10',
    createdAt: '2026-08-10T10:00:00.000Z',
    updatedAt: '2026-08-10T10:00:00.000Z',
  },
  {
    id: 'gal-3',
    mediaType: 'photo',
    title: 'Seerat & Ethical Education Assembly',
    caption: 'Annual educational gathering and Seerat competition award distribution for students in Gokak.',
    category: 'Seerat & Programs',
    mediaUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1000&auto=format&fit=crop&q=80',
    published: true,
    date: '2026-07-25',
    createdAt: '2026-07-25T10:00:00.000Z',
    updatedAt: '2026-07-25T10:00:00.000Z',
  }
];

let localDemoGallery: GalleryItem[] = [...INITIAL_GALLERY_ITEMS];

export async function getPublishedGallery(): Promise<GalleryItem[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('published', '==', true)
    );
    const snapshot = await getDocs(q);
    const items = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<GalleryItem, 'id'>)
    }));

    if (items.length === 0) {
      return localDemoGallery.filter((i) => i.published);
    }

    // Sort in memory by date/createdAt desc
    return items.sort((a, b) => (b.date || b.createdAt).localeCompare(a.date || a.createdAt));
  } catch (error) {
    console.warn('Notice loading gallery from Firestore, using curated items:', error);
    return localDemoGallery.filter((i) => i.published);
  }
}

export async function getAllGallery(): Promise<GalleryItem[]> {
  if (!auth.currentUser) {
    return [...localDemoGallery];
  }
  try {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    const items = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<GalleryItem, 'id'>)
    }));

    if (items.length === 0) {
      return localDemoGallery;
    }

    return items.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  } catch (error) {
    if (!auth.currentUser) {
      return localDemoGallery;
    }
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
  }
}

export async function addGalleryItem(
  item: Omit<GalleryItem, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const now = new Date().toISOString();
  if (!auth.currentUser) {
    const newItem: GalleryItem = {
      ...item,
      id: `demo-gal-${Date.now()}`,
      createdAt: now,
      updatedAt: now
    };
    localDemoGallery.unshift(newItem);
    return newItem.id;
  }
  const docRef = doc(collection(db, COLLECTION_NAME));
  const payload: Omit<GalleryItem, 'id'> = {
    ...item,
    createdAt: now,
    updatedAt: now
  };

  try {
    await setDoc(docRef, payload);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${COLLECTION_NAME}/${docRef.id}`);
  }
}

export async function updateGalleryItem(
  id: string,
  data: Partial<GalleryItem>
): Promise<void> {
  if (!auth.currentUser) {
    localDemoGallery = localDemoGallery.map((i) =>
      i.id === id ? { ...i, ...data, updatedAt: new Date().toISOString() } : i
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

export async function deleteGalleryItem(id: string): Promise<void> {
  if (!auth.currentUser) {
    localDemoGallery = localDemoGallery.filter((i) => i.id !== id);
    return;
  }
  const docRef = doc(db, COLLECTION_NAME, id);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${id}`);
  }
}
