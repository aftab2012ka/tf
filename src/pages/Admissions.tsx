import AdmissionForm from '../components/AdmissionForm';
import { BookOpen, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';

export default function Admissions() {
  return (
    <div className="py-12 sm:py-16 space-y-12 bg-gray-50/50 min-h-[calc(100vh-80px)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
          Admissions Open
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
          Apply for Admission
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Submit your application to enroll in Tuba Foundation Gokak's computer training, tailoring, beauty wellness, or educational programs.
        </p>

        {/* Informative Badges */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-600">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#0e6245]" />
            Practical Skill Curriculum
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#0e6245]" />
            Batches Configured Regularly
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#0e6245]" />
            Confidential & Verified Review
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <AdmissionForm />
      </div>
    </div>
  );
}
