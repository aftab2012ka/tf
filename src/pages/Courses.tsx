import { Link } from 'react-router-dom';
import { Monitor, Scissors, Sparkles, BookOpen, CheckCircle2, ArrowRight } from 'lucide-react';
import { COURSES } from '../data/courses';

export default function Courses() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Monitor':
        return <Monitor className="w-8 h-8 text-[#0e6245]" />;
      case 'Scissors':
        return <Scissors className="w-8 h-8 text-[#0e6245]" />;
      case 'Sparkles':
        return <Sparkles className="w-8 h-8 text-[#0e6245]" />;
      case 'BookOpen':
      default:
        return <BookOpen className="w-8 h-8 text-[#0e6245]" />;
    }
  };

  return (
    <div className="py-12 sm:py-16 space-y-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
          Vocational & Academic Development
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight mt-3">
          Our Courses & Programs
        </h1>
        <p className="text-base text-gray-600 mt-3 leading-relaxed">
          Tuba Foundation Gokak offers specialized training modules focused on vocational craft, digital literacy, and community education to foster self-reliance and dignity.
        </p>
      </div>

      {/* Courses List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {COURSES.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-gray-200/90 shadow-xs hover:shadow-md transition-shadow p-6 sm:p-8 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                    {getIcon(course.icon)}
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200/60 uppercase tracking-wider">
                    {course.category}
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-gray-950 tracking-tight">
                    {course.title}
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {course.overview}
                  </p>
                </div>

                {/* Modules */}
                <div className="bg-gray-50/70 p-5 rounded-xl border border-gray-100 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Syllabus & Core Modules
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {course.modules.map((mod, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-gray-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0e6245] shrink-0 mt-0.5" />
                        <span>{mod}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Eligibility note from PDF */}
                <div className="text-xs text-gray-500 italic">
                  <strong>Target Audience:</strong> {course.eligibility}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between gap-4">
                <Link
                  to={`/admissions?course=${encodeURIComponent(course.title)}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#0e6245] hover:bg-[#0b4d36] text-white font-semibold text-sm transition-colors shadow-xs"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
