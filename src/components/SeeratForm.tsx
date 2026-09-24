import { useState, FormEvent } from 'react';
import { CheckCircle2, Loader2, AlertCircle, Copy, Check, QrCode } from 'lucide-react';
import { registerParticipant } from '../services/participantService';
import { useToast } from '../context/ToastContext';

export default function SeeratForm() {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    gender: '' as 'Male' | 'Female' | 'Other' | '',
    age: '',
    qualification: '',
    study: '',
    marriageStatus: '' as 'Unmarried' | 'Married' | 'Other' | '',
    address: '',
    mobile: '',
    language: 'Urdu',
    paymentMode: 'UPI' as 'UPI' | 'Cash' | 'Other',
    paymentReference: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredId, setRegisteredId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.gender) {
      newErrors.gender = 'Please select gender';
    }

    if (!formData.age.trim()) {
      newErrors.age = 'Age is required';
    } else {
      const ageNum = parseInt(formData.age, 10);
      if (isNaN(ageNum) || ageNum < 6 || ageNum > 100) {
        newErrors.age = 'Please enter a valid age between 6 and 100';
      }
    }

    if (!formData.qualification.trim()) {
      newErrors.qualification = 'Educational qualification is required';
    }

    if (!formData.study.trim()) {
      newErrors.study = 'Current study or occupation is required';
    }

    if (!formData.marriageStatus) {
      newErrors.marriageStatus = 'Please select marital status';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Full residential address is required';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^[0-9+\-\s]{7,15}$/.test(formData.mobile.trim())) {
      newErrors.mobile = 'Please enter a valid mobile number';
    }

    if (!formData.language) {
      newErrors.language = 'Please select preferred exam language';
    }

    if (formData.paymentMode === 'UPI' && !formData.paymentReference.trim()) {
      // Prompt notes it as optional or recommended
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await registerParticipant({
        fullName: formData.fullName.trim(),
        gender: formData.gender as 'Male' | 'Female' | 'Other',
        age: formData.age.trim(),
        qualification: formData.qualification.trim(),
        study: formData.study.trim(),
        marriageStatus: formData.marriageStatus as 'Unmarried' | 'Married' | 'Other',
        address: formData.address.trim(),
        mobile: formData.mobile.trim(),
        language: formData.language,
        paymentMode: formData.paymentMode,
        paymentReference: formData.paymentReference.trim()
      });

      setRegisteredId(result.registrationId);
      showToast('Seerat program registration successful!', 'success');
    } catch (err: unknown) {
      console.error('Registration failed:', err);
      showToast('Registration failed. Please check network connection.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyId = () => {
    if (!registeredId) return;
    navigator.clipboard.writeText(registeredId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      gender: '',
      age: '',
      qualification: '',
      study: '',
      marriageStatus: '',
      address: '',
      mobile: '',
      language: 'Urdu',
      paymentMode: 'UPI',
      paymentReference: ''
    });
    setRegisteredId(null);
    setErrors({});
  };

  if (registeredId) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 sm:p-10 rounded-2xl border border-emerald-200/80 shadow-md text-center animate-fadeIn">
        <div className="w-16 h-16 bg-emerald-100 text-[#0e6245] rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <h3 className="text-2xl font-extrabold text-gray-950 tracking-tight">
          Registration Confirmed
        </h3>

        <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto leading-relaxed">
          You have successfully registered for the Seerat Exam / Program with Tuba Foundation Gokak.
        </p>

        <div className="mt-6 p-5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl max-w-md mx-auto">
          <span className="text-xs uppercase tracking-wider font-semibold text-emerald-800 block mb-1">
            Participant / Registration ID
          </span>
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl sm:text-2xl font-mono font-bold text-emerald-950 tracking-wide">
              {registeredId}
            </span>
            <button
              onClick={copyId}
              type="button"
              className="p-1.5 rounded-md hover:bg-emerald-200/60 text-emerald-800 transition-colors"
              title="Copy Registration ID"
              aria-label="Copy Registration ID"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Please quote this ID for exam admit card and certificate collection.
          </p>
        </div>

        <div className="mt-8">
          <button
            onClick={resetForm}
            type="button"
            className="px-6 py-2.5 rounded-lg bg-[#0e6245] hover:bg-[#0b4d36] text-white font-semibold text-sm transition-colors cursor-pointer"
          >
            Register Another Participant
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="max-w-3xl mx-auto bg-white p-6 sm:p-10 rounded-2xl border border-gray-200/90 shadow-xs"
    >
      <div className="border-b border-gray-100 pb-6 mb-6">
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Seerat Exam / Program Registration
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Register for the annual Seerat-un-Nabi competitive exam and study program. All fields marked with <span className="text-red-500 font-semibold">*</span> are required.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Full Name */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="Participant full legal name"
            className={`w-full px-4 py-2.5 rounded-lg border text-sm text-gray-900 transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-600 ${
              errors.fullName ? 'border-red-500 bg-red-50/20' : 'border-gray-300 hover:border-gray-400'
            }`}
          />
          {errors.fullName && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Male' | 'Female' | 'Other' })}
            className={`w-full px-4 py-2.5 rounded-lg border text-sm text-gray-900 transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-600 ${
              errors.gender ? 'border-red-500 bg-red-50/20' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.gender}
            </p>
          )}
        </div>

        {/* Age */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
            Age <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="6"
            max="100"
            required
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            placeholder="Participant age"
            className={`w-full px-4 py-2.5 rounded-lg border text-sm text-gray-900 transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-600 ${
              errors.age ? 'border-red-500 bg-red-50/20' : 'border-gray-300 hover:border-gray-400'
            }`}
          />
          {errors.age && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.age}
            </p>
          )}
        </div>

        {/* Qualification */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
            Qualification <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.qualification}
            onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
            placeholder="e.g. Primary / SSLC / PUC / Degree"
            className={`w-full px-4 py-2.5 rounded-lg border text-sm text-gray-900 transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-600 ${
              errors.qualification ? 'border-red-500 bg-red-50/20' : 'border-gray-300 hover:border-gray-400'
            }`}
          />
          {errors.qualification && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.qualification}
            </p>
          )}
        </div>

        {/* Current Study / Education */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
            Current Study / Education <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.study}
            onChange={(e) => setFormData({ ...formData, study: e.target.value })}
            placeholder="Current class / college / occupation"
            className={`w-full px-4 py-2.5 rounded-lg border text-sm text-gray-900 transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-600 ${
              errors.study ? 'border-red-500 bg-red-50/20' : 'border-gray-300 hover:border-gray-400'
            }`}
          />
          {errors.study && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.study}
            </p>
          )}
        </div>

        {/* Marital Status */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
            Marital Status <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={formData.marriageStatus}
            onChange={(e) => setFormData({ ...formData, marriageStatus: e.target.value as 'Unmarried' | 'Married' | 'Other' })}
            className={`w-full px-4 py-2.5 rounded-lg border text-sm text-gray-900 transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-600 ${
              errors.marriageStatus ? 'border-red-500 bg-red-50/20' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <option value="">Select Status</option>
            <option value="Unmarried">Unmarried</option>
            <option value="Married">Married</option>
            <option value="Other">Other</option>
          </select>
          {errors.marriageStatus && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.marriageStatus}
            </p>
          )}
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            required
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            placeholder="10-digit phone number"
            className={`w-full px-4 py-2.5 rounded-lg border text-sm text-gray-900 transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-600 ${
              errors.mobile ? 'border-red-500 bg-red-50/20' : 'border-gray-300 hover:border-gray-400'
            }`}
          />
          {errors.mobile && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.mobile}
            </p>
          )}
        </div>

        {/* Preferred Language */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
            Preferred Language <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['Urdu', 'Kannada', 'English', 'Hindi'].map((lang) => (
              <label
                key={lang}
                className={`flex items-center gap-2 p-3 rounded-lg border text-sm cursor-pointer transition-colors ${
                  formData.language === lang
                    ? 'border-[#0e6245] bg-emerald-50/70 text-[#0e6245] font-semibold'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="seeratLang"
                  value={lang}
                  checked={formData.language === lang}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="text-[#0e6245] focus:ring-emerald-600"
                />
                <span>{lang}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Full Address */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
            Full Address <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            required
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Full residential address in Gokak or surrounding locality"
            className={`w-full px-4 py-2.5 rounded-lg border text-sm text-gray-900 transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-600 ${
              errors.address ? 'border-red-500 bg-red-50/20' : 'border-gray-300 hover:border-gray-400'
            }`}
          />
          {errors.address && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.address}
            </p>
          )}
        </div>
      </div>

      {/* Payment Section with Mandatory Marked Placeholders */}
      <div className="mt-8 pt-6 border-t border-gray-200 space-y-5">
        <div>
          <h3 className="text-base font-bold text-gray-900">
            Registration Fee / Payment Section
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Select your preferred method to complete registration.
          </p>
        </div>

        {/* Payment Mode */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
            Payment Mode <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['UPI', 'Cash', 'Other'] as const).map((mode) => (
              <label
                key={mode}
                className={`flex items-center justify-center p-3 rounded-lg border text-sm cursor-pointer transition-colors ${
                  formData.paymentMode === mode
                    ? 'border-[#0e6245] bg-emerald-50 text-[#0e6245] font-bold'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMode"
                  value={mode}
                  checked={formData.paymentMode === mode}
                  onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value as 'UPI' | 'Cash' | 'Other' })}
                  className="sr-only"
                />
                <span>{mode}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Temporary Dummy Payment Section as required by Prompt Section 10 */}
        {formData.paymentMode === 'UPI' && (
          <div className="p-5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3 animate-fadeIn">
            <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider">
              <QrCode className="w-4 h-4" />
              <span>DUMMY PAYMENT QR — REPLACE BEFORE LAUNCH</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-lg border border-amber-200/60">
              {/* Dummy QR placeholder graphic */}
              <div className="w-32 h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-center p-2 shrink-0">
                <QrCode className="w-12 h-12 text-gray-400 mb-1" />
                <span className="text-[10px] font-bold text-gray-600 leading-tight uppercase">
                  DUMMY QR<br />DEMO ONLY
                </span>
              </div>
              <div className="text-xs text-gray-600 space-y-1.5">
                <p className="font-semibold text-gray-800">
                  Scan via any UPI app (GPay / PhonePe / Paytm)
                </p>
                <p className="text-gray-500">
                  Notice: This is a placeholder test QR for demonstration. Official payment QR will be configured before live launch.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Payment Reference / Transaction ID <span className="text-gray-400 font-normal normal-case">(Optional)</span>
              </label>
              <input
                type="text"
                value={formData.paymentReference}
                onChange={(e) => setFormData({ ...formData, paymentReference: e.target.value })}
                placeholder="e.g. 12-digit UPI reference number"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 hover:border-gray-400 text-sm text-gray-900 transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-white"
              />
            </div>
          </div>
        )}

        {formData.paymentMode === 'Cash' && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-600">
            Cash payment can be submitted directly at the Tuba Foundation Gokak office desk upon arrival.
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-[#0e6245] hover:bg-[#0b4d36] disabled:opacity-70 text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Registering Participant...</span>
            </>
          ) : (
            <span>Register Now</span>
          )}
        </button>
      </div>
    </form>
  );
}
