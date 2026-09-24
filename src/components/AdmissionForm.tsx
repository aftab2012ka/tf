import { useState, FormEvent, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Loader2, AlertCircle, Copy, Check, ArrowRight } from 'lucide-react';
import { COURSES } from '../data/courses';
import { submitAdmission } from '../services/admissionService';
import { useToast } from '../context/ToastContext';

export default function AdmissionForm() {
  const [searchParams] = useSearchParams();
  const initialCourse = searchParams.get('course') || '';
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    gender: '' as 'Male' | 'Female' | 'Other' | '',
    age: '',
    qualification: '',
    course: initialCourse,
    address: '',
    mobile: '',
    email: '',
    language: 'English',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApplicationId, setSubmittedApplicationId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialCourse && !formData.course) {
      setFormData((prev) => ({ ...prev, course: initialCourse }));
    }
  }, [initialCourse]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.length > 120) {
      newErrors.fullName = 'Name cannot exceed 120 characters';
    }

    if (!formData.gender) {
      newErrors.gender = 'Please select a gender';
    }

    if (!formData.age.trim()) {
      newErrors.age = 'Age is required';
    } else {
      const ageNum = parseInt(formData.age, 10);
      if (isNaN(ageNum) || ageNum < 10 || ageNum > 100) {
        newErrors.age = 'Please enter a valid age between 10 and 100';
      }
    }

    if (!formData.qualification.trim()) {
      newErrors.qualification = 'Educational qualification is required';
    }

    if (!formData.course) {
      newErrors.course = 'Please select a course';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Residential address is required';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^[0-9+\-\s]{7,15}$/.test(formData.mobile.trim())) {
      newErrors.mobile = 'Please enter a valid mobile number';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.language) {
      newErrors.language = 'Please select a preferred language';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please check the highlighted fields', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitAdmission({
        fullName: formData.fullName.trim(),
        gender: formData.gender as 'Male' | 'Female' | 'Other',
        age: formData.age.trim(),
        qualification: formData.qualification.trim(),
        course: formData.course,
        address: formData.address.trim(),
        mobile: formData.mobile.trim(),
        email: formData.email.trim(),
        language: formData.language,
        message: formData.message.trim()
      });

      setSubmittedApplicationId(result.applicationId);
      showToast('Your admission application has been submitted successfully.', 'success');
    } catch (err: unknown) {
      console.error('Submission failed:', err);
      showToast('Could not submit application. Please verify your connection.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyId = () => {
    if (!submittedApplicationId) return;
    navigator.clipboard.writeText(submittedApplicationId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      gender: '',
      age: '',
      qualification: '',
      course: '',
      address: '',
      mobile: '',
      email: '',
      language: 'English',
      message: ''
    });
    setSubmittedApplicationId(null);
    setErrors({});
  };

  if (submittedApplicationId) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 sm:p-10 rounded-2xl border border-emerald-200/80 shadow-md text-center animate-fadeIn">
        <div className="w-16 h-16 bg-emerald-100 text-[#0e6245] rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <h3 className="text-2xl font-extrabold text-gray-950 tracking-tight">
          Application Submitted Successfully
        </h3>

        <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto leading-relaxed">
          Your admission application has been submitted successfully to Tuba Foundation Gokak.
        </p>

        <div className="mt-6 p-5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl max-w-md mx-auto">
          <span className="text-xs uppercase tracking-wider font-semibold text-emerald-800 block mb-1">
            Your Unique Application ID
          </span>
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl sm:text-2xl font-mono font-bold text-emerald-950 tracking-wide">
              {submittedApplicationId}
            </span>
            <button
              onClick={copyId}
              type="button"
              className="p-1.5 rounded-md hover:bg-emerald-200/60 text-emerald-800 transition-colors"
              title="Copy Application ID"
              aria-label="Copy Application ID"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Please keep this ID for your records and future inquiries.
          </p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={resetForm}
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            Submit Another Application
          </button>
          <Link
            to="/courses"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#0e6245] hover:bg-[#0b4d36] text-white font-semibold text-sm transition-colors"
          >
            <span>Explore More Courses</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
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
          Course Admission Form
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Complete the details below to apply for courses at Tuba Foundation Gokak. Fields marked with <span className="text-red-500 font-semibold">*</span> are required.
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
            placeholder="e.g. Fatima Khan / Mohammed Zaid"
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
            <option value="Female">Female</option>
            <option value="Male">Male</option>
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
            min="10"
            max="100"
            required
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            placeholder="e.g. 21"
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
            Educational Qualification <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.qualification}
            onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
            placeholder="e.g. 10th / PUC / Graduate / Pursuing"
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

        {/* Course Interested In */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
            Course Interested In <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={formData.course}
            onChange={(e) => setFormData({ ...formData, course: e.target.value })}
            className={`w-full px-4 py-2.5 rounded-lg border text-sm text-gray-900 transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-600 ${
              errors.course ? 'border-red-500 bg-red-50/20' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <option value="">Select a Course</option>
            {COURSES.map((c) => (
              <option key={c.id} value={c.title}>
                {c.title}
              </option>
            ))}
          </select>
          {errors.course && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.course}
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
            placeholder="10-digit mobile number"
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

        {/* Email Address */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
            Email Address <span className="text-gray-400 font-normal normal-case">(Optional)</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="applicant@example.com"
            className={`w-full px-4 py-2.5 rounded-lg border text-sm text-gray-900 transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-600 ${
              errors.email ? 'border-red-500 bg-red-50/20' : 'border-gray-300 hover:border-gray-400'
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Preferred Language */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
            Preferred Language <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['English', 'Kannada', 'Urdu', 'Hindi'].map((lang) => (
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
                  name="language"
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
            Full Residential Address <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            required
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="House / Street / Locality in Gokak or surrounding area"
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

        {/* Additional Message */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
            Additional Message <span className="text-gray-400 font-normal normal-case">(Optional)</span>
          </label>
          <textarea
            rows={2}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Any specific inquiry or prior background you would like to mention..."
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 hover:border-gray-400 text-sm text-gray-900 transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
          />
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-gray-500">
          Your information will be securely reviewed by Tuba Foundation administration.
        </p>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-lg bg-[#0e6245] hover:bg-[#0b4d36] disabled:opacity-70 text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting Application...</span>
            </>
          ) : (
            <span>Submit Admission Form</span>
          )}
        </button>
      </div>
    </form>
  );
}
