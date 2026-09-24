import Gallery from '../components/Gallery';

export default function GalleryPage() {
  return (
    <div className="py-12 sm:py-16 space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
          Photographs & Media
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight mt-3">
          Our Work Gallery
        </h1>
        <p className="text-base text-gray-600 mt-3 leading-relaxed">
          Documenting activities, skill training workshops, educational sessions, and community initiatives conducted by Tuba Foundation Gokak.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Gallery showFilters={true} />
      </div>
    </div>
  );
}
