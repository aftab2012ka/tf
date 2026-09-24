import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/firestore';
import { DonationSettingsData, SiteSettingsData } from '../types';

export const DEFAULT_DONATION_SETTINGS: DonationSettingsData = {
  accountName: 'Tuba Foundation',
  bankName: '[BANK NAME]',
  accountNumber: '[ACCOUNT NUMBER]',
  ifsc: '[IFSC CODE]',
  branch: 'Gokak',
  upiId: '[UPI ID]',
  qrImageUrl: '',
  contactInfo: '[DONATION CONTACT NUMBER]',
  updatedAt: new Date().toISOString()
};

export const DEFAULT_SITE_SETTINGS: SiteSettingsData = {
  foundationName: 'TUBA FOUNDATION GOKAK',
  tagline: 'Empowering Through Education & Skill Development',
  contactEmail: '[FOUNDATION EMAIL]',
  contactPhone: '[DONATION CONTACT NUMBER]',
  contactAddress: 'Gokak, Belagavi District, Karnataka, India',
  logoUrl: '',
  footerText: 'TUBA FOUNDATION GOKAK — Dedicated to community upliftment through vocational skills, digital literacy, and holistic education.',
  updatedAt: new Date().toISOString()
};

const DONATION_DOC_PATH = 'donationSettings/default';
const SITE_DOC_PATH = 'siteSettings/default';

export async function getDonationSettings(): Promise<DonationSettingsData> {
  try {
    const docRef = doc(db, 'donationSettings', 'default');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { ...DEFAULT_DONATION_SETTINGS, ...(snap.data() as DonationSettingsData) };
    }
    return DEFAULT_DONATION_SETTINGS;
  } catch (error) {
    console.warn('Could not fetch donation settings from Firestore, using default placeholders:', error);
    return DEFAULT_DONATION_SETTINGS;
  }
}

export async function saveDonationSettings(settings: Partial<DonationSettingsData>): Promise<void> {
  try {
    const docRef = doc(db, 'donationSettings', 'default');
    const payload = {
      ...settings,
      updatedAt: new Date().toISOString()
    };
    await setDoc(docRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, DONATION_DOC_PATH);
  }
}

export async function getSiteSettings(): Promise<SiteSettingsData> {
  try {
    const docRef = doc(db, 'siteSettings', 'default');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { ...DEFAULT_SITE_SETTINGS, ...(snap.data() as SiteSettingsData) };
    }
    return DEFAULT_SITE_SETTINGS;
  } catch (error) {
    console.warn('Could not fetch site settings from Firestore, using defaults:', error);
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function saveSiteSettings(settings: Partial<SiteSettingsData>): Promise<void> {
  try {
    const docRef = doc(db, 'siteSettings', 'default');
    const payload = {
      ...settings,
      updatedAt: new Date().toISOString()
    };
    await setDoc(docRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, SITE_DOC_PATH);
  }
}
