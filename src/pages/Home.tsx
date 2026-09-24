import { Link } from 'react-router-dom';
import { Target, Compass, ArrowRight, BookOpen, ShieldCheck, HeartHandshake } from 'lucide-react';
import Hero from '../components/Hero';
import CourseCard from '../components/CourseCard';
import Gallery from '../components/Gallery';
import { COURSES } from '../data/courses';

export default function Home() {
  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 5. Hero Section */}
      <Hero />

      {/* 6. About Us Section & 7. Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
            About Tuba Foundation
          </span>
          <h2 className="text-3xl font-extrabold text-gray-950 tracking-tight">
            Building Self-Reliance Through Education
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Tuba Foundation, Gokak is an educational and skill-development initiative established to provide practical learning, vocational empowerment, and ethical grounding to the youth and community.
          </p>
        </div>

        {/* 7. Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vision Card */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200/90 shadow-xs hover:border-emerald-300 transition-colors flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#0e6245] flex items-center justify-center border border-emerald-100">
                <Compass className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-950 tracking-tight">
                  Our Vision
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-serif italic text-gray-800/90">
                  "An empowered, educated, and self-reliant community where every individual has access to knowledge, dignified livelihoods, and holistic skill development."
                </p>
              </div>
            </div>
            <div className="pt-6 border-t border-gray-100 mt-6 flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-[#0e6245]" />
              <span>Equal Opportunity & Lifelong Dignity</span>
            </div>
          </div>

          {/* Mission Card */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200/90 shadow-xs hover:border-emerald-300 transition-colors flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#0e6245] flex items-center justify-center border border-emerald-100">
                <Target className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-950 tracking-tight">
                  Our Mission
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-serif italic text-gray-800/90">
                  "To empower individuals, youth, and women through quality education, practical vocational skills, computer literacy, and ethical development, fostering self-reliance and community well-being in Gokak."
                </p>
              </div>
            </div>
            <div className="pt-6 border-t border-gray-100 mt-6 flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <HeartHandshake className="w-4 h-4 text-[#0e6245]" />
              <span>Community-Led Vocational Empowerment</span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Courses / Programs Section */}
      <section className="bg-gray-50/70 py-16 sm:py-24 border-y border-gray-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
                Practical Learning
              </span>
              <h2 className="text-3xl font-extrabold text-gray-950 tracking-tight">
                Our Courses & Programs
              </h2>
              <p className="text-sm text-gray-600 max-w-xl">
                Hands-on training curriculum developed to impart high-demand digital and vocational skills.
              </p>
            </div>

            <Link
              to="/courses"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0e6245] hover:text-[#0b4d36] transition-colors"
            >
              <span>View All Courses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {COURSES.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* 12. Work Gallery Section Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
              Visual Highlights
            </span>
            <h2 className="text-3xl font-extrabold text-gray-950 tracking-tight mt-2">
              Our Work Gallery
            </h2>
          </div>

          <Link
            to="/gallery"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0e6245] hover:text-[#0b4d36] transition-colors"
          >
            <span>Browse Full Gallery</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <Gallery limit={3} showFilters={false} />
      </section>

      {/* Community Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-2xl bg-[#0e6245] text-white p-8 sm:p-12 lg:p-14 shadow-lg flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center lg:text-left max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to enhance your skills or participate in Seerat programs?
            </h2>
            <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
              Admissions are open for our computer education and vocational training batches. Register today or contact us to support our educational mission.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
            <Link
              to="/admissions"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-white text-[#0e6245] hover:bg-emerald-50 font-bold text-sm shadow-xs transition-colors"
            >
              <span>Apply for Admission</span>
            </Link>

            <Link
              to="/donations"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-emerald-800/70 hover:bg-emerald-800 text-white font-semibold text-sm border border-emerald-600/50 transition-colors"
            >
              <span>Support Our Work</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
