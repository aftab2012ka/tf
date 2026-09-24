import { useState, useEffect, FormEvent } from 'react';
import { Landmark, QrCode, Phone, Save, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getDonationSettings, saveDonationSettings } from '../../services/settingsService';
import { DonationSettingsData } from '../../types';
import { useToast } from '../../context/ToastContext';
import { uploadMediaFile } from '../../firebase/storage';

export default function DonationSettings() {
  const [settings, setSettings] = useState<DonationSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [qrFile, setQrFile] = useState<File | null>(null);

  const { showToast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        const data = await getDonationSettings();
        setSettings(data);
      } catch (err) {
        console.warn('Error fetching donation settings:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    try {
      let finalQrUrl = settings.qrImageUrl;

      if (qrFile) {
        try {
          finalQrUrl = await uploadMediaFile(qrFile, 'branding');
        } catch (err) {
          console.warn('Storage upload fallback:', err);
          finalQrUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(qrFile);
          });
        }
      }

      const updatedPayload: Partial<DonationSettingsData> = {
        ...settings,
        qrImageUrl: finalQrUrl
      };

      await saveDonationSettings(updatedPayload);
      setSettings((prev) => (prev ? { ...prev, ...updatedPayload } : null));
      setQrFile(null);
      showToast('Donation settings saved successfully! Public page updated.', 'success');
    } catch (err) {
      showToast('Failed to save settings. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center text-gray-500">
        <div className="w-8 h-8 border-2 border-[#0e6245] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const s = settings!;

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-950 tracking-tight">
          Donation & Banking Configuration
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Update the official bank details and UPI QR code. Changes take effect on the public donation page instantly.
        </p>
      </div>

      <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-start gap-3 text-xs text-emerald-950 leading-relaxed">
        <CheckCircle2 className="w-4 h-4 text-[#0e6245] shrink-0 mt-0.5" />
        <div>
          Any details updated below replace the initial placeholders immediately without modifying source code.
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-gray-100 text-[#0e6245]">
          <Landmark className="w-5 h-5" />
          <h2 className="text-base font-bold text-gray-900">Bank Account Details</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
              Account Name
            </label>
            <input
              type="text"
              required
              value={s.accountName}
              onChange={(e) => setSettings({ ...s, accountName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
              Bank Name
            </label>
            <input
              type="text"
              required
              value={s.bankName}
              onChange={(e) => setSettings({ ...s, bankName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
              Account Number
            </label>
            <input
              type="text"
              required
              value={s.accountNumber}
              onChange={(e) => setSettings({ ...s, accountNumber: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 font-mono font-bold focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
              IFSC Code
            </label>
            <input
              type="text"
              required
              value={s.ifsc}
              onChange={(e) => setSettings({ ...s, ifsc: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 font-mono font-bold focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
              Branch Location
            </label>
            <input
              type="text"
              required
              value={s.branch}
              onChange={(e) => setSettings({ ...s, branch: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex items-center gap-2 text-[#0e6245]">
          <QrCode className="w-5 h-5" />
          <h2 className="text-base font-bold text-gray-900">UPI & QR Code Configuration</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
              UPI ID
            </label>
            <input
              type="text"
              value={s.upiId}
              onChange={(e) => setSettings({ ...s, upiId: e.target.value })}
              placeholder="e.g. tubafoundation@bank"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 font-mono focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
              Donation Contact Phone / WhatsApp
            </label>
            <input
              type="text"
              value={s.contactInfo}
              onChange={(e) => setSettings({ ...s, contactInfo: e.target.value })}
              placeholder="e.g. +91 9876543210"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="sm:col-span-2 space-y-2">
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
              Upload Official QR Code Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setQrFile(e.target.files[0]);
                }
              }}
              className="w-full text-xs text-gray-600 file:mr-3 file:py-2 file:px-3.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#0e6245] file:text-white hover:file:bg-[#0b4d36] cursor-pointer"
            />
            <p className="text-[11px] text-gray-400">
              Or leave empty to use current QR image / dummy placeholder.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#0e6245] hover:bg-[#0b4d36] disabled:opacity-70 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Donation Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
