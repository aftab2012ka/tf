import SeeratForm from '../components/SeeratForm';
import { BookOpen, Award, Users, CheckCircle2 } from 'lucide-react';

export default function Seerat() {
  return (
    <div className="py-12 sm:py-16 space-y-12 bg-gray-50/50 min-h-[calc(100vh-80px)]">
      {/* Page Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
          Annual Educational Initiative
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
          Seerat Exam & Program Registration
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Participate in the educational Seerat-un-Nabi study circles, annual examinations, and community moral guidance programs organized by Tuba Foundation Gokak.
        </p>

        {/* Highlight points */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-600">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-[#0e6245]" />
            Comprehensive Study Curriculum
          </span>
          <span className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#0e6245]" />
            Merit Recognition & Certification
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#0e6245]" />
            Open for All Age Groups
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <SeeratForm />
      </div>
    </div>
  );
}
