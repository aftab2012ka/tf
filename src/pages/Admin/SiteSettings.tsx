import { useState, useEffect, FormEvent } from 'react';
import { Settings, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { getSiteSettings, saveSiteSettings } from '../../services/settingsService';
import { SiteSettingsData } from '../../types';
import { useToast } from '../../context/ToastContext';

export default function SiteSettings() {
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        const data = await getSiteSettings();
        setSettings(data);
      } catch (err) {
        console.warn('Error loading site settings:', err);
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
      await saveSiteSettings(settings);
      showToast('Site settings updated successfully', 'success');
    } catch (err) {
      showToast('Failed to save settings', 'error');
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
          General Site Configuration
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Configure core organization contact points and branding details.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-gray-100 text-[#0e6245]">
          <Settings className="w-5 h-5" />
          <h2 className="text-base font-bold text-gray-900">Foundation Identity</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
              Foundation Legal Name
            </label>
            <input
              type="text"
              required
              value={s.foundationName}
              onChange={(e) => setSettings({ ...s, foundationName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 font-bold focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
              Tagline / Subtitle
            </label>
            <input
              type="text"
              value={s.tagline}
              onChange={(e) => setSettings({ ...s, tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
              Official Contact Email
            </label>
            <input
              type="email"
              value={s.contactEmail}
              onChange={(e) => setSettings({ ...s, contactEmail: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
              Contact Phone
            </label>
            <input
              type="tel"
              value={s.contactPhone}
              onChange={(e) => setSettings({ ...s, contactPhone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
              Registered Office Address
            </label>
            <textarea
              rows={2}
              value={s.contactAddress}
              onChange={(e) => setSettings({ ...s, contactAddress: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
              Footer Description Note
            </label>
            <textarea
              rows={3}
              value={s.footerText}
              onChange={(e) => setSettings({ ...s, footerText: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600"
            />
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
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Site Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
