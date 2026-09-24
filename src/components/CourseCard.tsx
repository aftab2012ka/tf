import { Link } from 'react-router-dom';
import { Monitor, Scissors, Sparkles, BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CourseData } from '../types';

interface CourseCardProps {
  course: CourseData;
}

export default function CourseCard({ course }: CourseCardProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Monitor':
        return <Monitor className="w-6 h-6 text-[#0e6245]" />;
      case 'Scissors':
        return <Scissors className="w-6 h-6 text-[#0e6245]" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-[#0e6245]" />;
      case 'BookOpen':
      default:
        return <BookOpen className="w-6 h-6 text-[#0e6245]" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/90 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden">
      <div className="p-6 sm:p-7 space-y-4">
        {/* Category & Icon */}
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100/60 flex items-center justify-center">
            {getIcon(course.icon)}
          </div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60">
            {course.category}
          </span>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">
            {course.title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {course.shortDescription}
          </p>
        </div>

        {/* Modules List from PDF */}
        <div className="pt-2 border-t border-gray-100">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2.5">
            Key Modules
          </h4>
          <ul className="space-y-2">
            {course.modules.map((mod, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0e6245] shrink-0 mt-0.5" />
                <span className="leading-snug">{mod}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Card Action */}
      <div className="p-6 sm:p-7 pt-0">
        <Link
          to={`/admissions?course=${encodeURIComponent(course.title)}`}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gray-50 hover:bg-[#0e6245] text-gray-900 hover:text-white font-semibold text-sm border border-gray-200 hover:border-[#0e6245] transition-all group"
        >
          <span>Apply Now</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
