import { useState, useEffect } from 'react';
import { Landmark, QrCode, Phone, Mail, MapPin, Copy, Check, Heart, ShieldCheck, AlertCircle } from 'lucide-react';
import { getDonationSettings } from '../services/settingsService';
import { DonationSettingsData } from '../types';
import { useToast } from '../context/ToastContext';

export default function Donations() {
  const [settings, setSettings] = useState<DonationSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        const data = await getDonationSettings();
        setSettings(data);
      } catch (err) {
        console.warn('Failed to load donation settings:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    showToast(`${label} copied to clipboard`, 'info');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryPhone.trim()) {
      showToast('Please provide your name and phone number', 'error');
      return;
    }
    setInquirySubmitted(true);
    showToast('Your donation inquiry has been received. Our team will contact you.', 'success');
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
    <div className="py-12 sm:py-16 space-y-16">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
          Support Community Upliftment
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
          Contact for Donations
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Your voluntary support powers computer education, sewing machine vocational centers, and educational programs for students and youth in Gokak.
        </p>

        <div className="pt-2 flex justify-center">
          <button
            onClick={() => setShowInquiryModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0e6245] hover:bg-[#0b4d36] text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer"
          >
            <Heart className="w-4 h-4 text-emerald-300 fill-emerald-300" />
            <span>Contact for Donation</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Bank Transfer Details */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#0e6245] flex items-center justify-center">
                <Landmark className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Direct Bank Transfer</h2>
                <p className="text-xs text-gray-500">Official Foundation Account Details</p>
              </div>
            </div>

            {/* Prominent Demo Notice as required by master prompt Section 11 */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 flex items-start gap-3 text-xs leading-relaxed">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block uppercase tracking-wider text-[11px]">
                  DEMO / PLACEHOLDER DETAILS — REPLACE BEFORE WEBSITE LAUNCH
                </strong>
                The details below are placeholders. Authorized administrators can update the bank credentials dynamically via the Admin Settings panel.
              </div>
            </div>

            {/* Account Information Key-Value Cards */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-lg border border-gray-100">
                <div>
                  <span className="text-xs uppercase font-semibold text-gray-500 block">Account Name</span>
                  <span className="font-bold text-gray-900">{s.accountName}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(s.accountName, 'Account Name')}
                  className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors"
                  title="Copy"
                >
                  {copiedField === 'Account Name' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-lg border border-gray-100">
                <div>
                  <span className="text-xs uppercase font-semibold text-gray-500 block">Bank Name</span>
                  <span className="font-bold text-gray-900">{s.bankName}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(s.bankName, 'Bank Name')}
                  className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors"
                  title="Copy"
                >
                  {copiedField === 'Bank Name' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-lg border border-gray-100">
                <div>
                  <span className="text-xs uppercase font-semibold text-gray-500 block">Account Number</span>
                  <span className="font-mono font-bold text-gray-900 tracking-wider">{s.accountNumber}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(s.accountNumber, 'Account Number')}
                  className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors"
                  title="Copy"
                >
                  {copiedField === 'Account Number' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <span className="text-xs uppercase font-semibold text-gray-500 block">IFSC Code</span>
                    <span className="font-mono font-bold text-gray-900">{s.ifsc}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(s.ifsc, 'IFSC Code')}
                    className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors"
                    title="Copy"
                  >
                    {copiedField === 'IFSC Code' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <span className="text-xs uppercase font-semibold text-gray-500 block">Branch</span>
                    <span className="font-bold text-gray-900">{s.branch}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(s.branch, 'Branch')}
                    className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors"
                    title="Copy"
                  >
                    {copiedField === 'Branch' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 text-xs text-gray-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0e6245]" />
              <span>Receipts provided upon intimation of transfer.</span>
            </div>
          </div>

          {/* UPI / QR Code Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6 text-center">
              <div className="flex items-center justify-center gap-2 text-[#0e6245]">
                <QrCode className="w-6 h-6" />
                <h2 className="text-xl font-bold text-gray-900">UPI / QR Donation</h2>
              </div>

              {/* Dummy QR Box */}
              <div className="relative mx-auto w-48 h-48 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center p-4">
                {s.qrImageUrl ? (
                  <img src={s.qrImageUrl} alt="Donation QR Code" className="w-full h-full object-contain" />
                ) : (
                  <>
                    <QrCode className="w-20 h-20 text-gray-400 mb-2" />
                    <span className="text-[11px] font-extrabold uppercase tracking-wide text-gray-600 leading-tight">
                      DUMMY DONATION QR<br />REPLACE BEFORE LAUNCH
                    </span>
                  </>
                )}
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs font-semibold text-amber-900">
                DUMMY DONATION QR — REPLACE BEFORE LAUNCH
              </div>

              {/* UPI ID */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between text-xs">
                <span className="text-gray-500 font-semibold uppercase">UPI ID:</span>
                <span className="font-mono font-bold text-gray-900">{s.upiId}</span>
                <button
                  onClick={() => copyToClipboard(s.upiId, 'UPI ID')}
                  className="p-1 text-gray-400 hover:text-gray-700"
                  title="Copy UPI ID"
                >
                  {copiedField === 'UPI ID' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Donation Contact Card */}
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 space-y-3">
              <h3 className="text-sm font-bold text-gray-900">Donation Contact Information</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                For questions regarding contributions, receipts, or sponsoring a course batch, please contact:
              </p>
              <div className="space-y-2 pt-1 text-xs text-gray-700 font-medium">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#0e6245]" />
                  <span>{s.contactInfo || '[DONATION CONTACT NUMBER]'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#0e6245]" />
                  <span>[FOUNDATION EMAIL]</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#0e6245]" />
                  <span>Gokak, Karnataka</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact for Donation Inquiry Modal */}
      {showInquiryModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowInquiryModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-xl border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            {inquirySubmitted ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-[#0e6245] rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Thank You For Your Support</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Your inquiry has been noted. Our administrative team will reach out to you with receipt and contribution details.
                </p>
                <button
                  onClick={() => {
                    setShowInquiryModal(false);
                    setInquirySubmitted(false);
                    setInquiryName('');
                    setInquiryPhone('');
                    setInquiryMessage('');
                  }}
                  className="px-6 py-2.5 rounded-lg bg-[#0e6245] text-white font-semibold text-sm"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Donation Inquiry Form</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Leave your contact details and our team will get in touch with you.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    placeholder="e.g. Brother / Sister Name"
                    className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Contact Phone / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Message / Area of Support (Optional)</label>
                  <textarea
                    rows={3}
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    placeholder="e.g. Sponsoring computer literacy, sewing machines, or general educational support"
                    className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowInquiryModal(false)}
                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-sm font-semibold bg-[#0e6245] hover:bg-[#0b4d36] text-white rounded-lg shadow-xs"
                  >
                    Send Inquiry
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
