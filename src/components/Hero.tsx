import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import logoUrl from '../assets/tuba-foundation-logo.jpg';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/50 via-white to-white py-16 sm:py-24 lg:py-28 border-b border-gray-100">
      {/* Subtle geometric background motif */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-emerald-100/60 blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-6 flex flex-col items-center">
          {/* Official Emblem */}
          <div className="relative group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white p-1 shadow-lg shadow-emerald-950/5 border-2 border-emerald-100 ring-4 ring-emerald-50/80 overflow-hidden flex items-center justify-center transition-transform hover:scale-105 duration-300">
              <img
                src={logoUrl}
                alt="Tuba Foundation Gokak Official Emblem"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-xs font-semibold text-[#0e6245]">
            <span className="w-2 h-2 rounded-full bg-[#0e6245] animate-pulse" />
            <span>Empowering Gokak Through Knowledge & Craft</span>
            <span className="text-emerald-300">•</span>
            <span className="font-serif tracking-normal font-bold text-emerald-900" dir="rtl">خدمت کر سکون پا</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-gray-950 tracking-tight leading-tight">
            TUBA FOUNDATION GOKAK
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto font-normal">
            Dedicated to community advancement through practical computer literacy, tailoring, vocational craft, and structured educational programs designed to build self-reliance and dignity.
          </p>

          {/* CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/courses"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-[#0e6245] hover:bg-[#0b4d36] text-white font-semibold text-sm shadow-xs transition-colors"
            >
              <span>Explore Courses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/admissions"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-white hover:bg-gray-50 text-gray-800 font-semibold text-sm border border-gray-300 shadow-xs transition-colors"
            >
              <span>Apply for Admission</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
