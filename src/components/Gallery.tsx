import { useState, useEffect } from 'react';
import { Image as ImageIcon, Video, Calendar, Eye, X, Play } from 'lucide-react';
import { GalleryItem } from '../types';
import { getPublishedGallery } from '../services/galleryService';

interface GalleryProps {
  limit?: number;
  showFilters?: boolean;
}

export default function Gallery({ limit, showFilters = true }: GalleryProps) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeMedia, setActiveMedia] = useState<GalleryItem | null>(null);

  useEffect(() => {
    async function loadGallery() {
      try {
        const data = await getPublishedGallery();
        setItems(data);
      } catch (err) {
        console.warn('Gallery loading notice:', err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  const categories = ['All', ...Array.from(new Set(items.map((i) => i.category).filter(Boolean)))];

  const filteredItems = items.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const displayedItems = limit ? filteredItems.slice(0, limit) : filteredItems;

  if (loading) {
    return (
      <div className="py-12 flex justify-center items-center text-gray-500">
        <div className="w-8 h-8 border-2 border-[#0e6245] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-16 px-4 text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <ImageIcon className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">Our Work Gallery</h3>
        <p className="text-sm text-gray-500 mt-1 leading-relaxed">
          Gallery updates will appear here soon.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Category Tabs */}
      {showFilters && categories.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#0e6245] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveMedia(item)}
            className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col"
          >
            {/* Media Preview Container */}
            <div className="relative aspect-4/3 bg-gray-100 overflow-hidden">
              {item.mediaType === 'video' ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-white text-white ml-1" />
                  </div>
                  <span className="absolute top-3 right-3 px-2 py-1 rounded bg-black/70 text-[11px] font-semibold flex items-center gap-1">
                    <Video className="w-3.5 h-3.5" /> Video
                  </span>
                </div>
              ) : (
                <img
                  src={item.mediaUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              )}

              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 text-xs font-semibold backdrop-blur-xs">
                  <Eye className="w-4 h-4" /> View
                </span>
              </div>
            </div>

            {/* Caption & Category */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
                  <span className="font-semibold text-emerald-800 uppercase tracking-wider">
                    {item.category}
                  </span>
                  {item.date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {item.date}
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-gray-900 leading-snug line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                  {item.caption}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Video Player Modal */}
      {activeMedia && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setActiveMedia(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-gray-950 rounded-2xl overflow-hidden border border-gray-800 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveMedia(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 hover:bg-black text-gray-300 hover:text-white transition-colors"
              aria-label="Close media preview"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Media Player / Image */}
            <div className="bg-black flex items-center justify-center max-h-[70vh]">
              {activeMedia.mediaType === 'video' ? (
                <video
                  src={activeMedia.mediaUrl}
                  controls
                  autoPlay
                  className="max-h-[70vh] w-full object-contain"
                >
                  Your browser does not support HTML5 video.
                </video>
              ) : (
                <img
                  src={activeMedia.mediaUrl}
                  alt={activeMedia.title}
                  className="max-h-[70vh] w-full object-contain"
                />
              )}
            </div>

            {/* Footer details */}
            <div className="p-6 bg-gray-900">
              <div className="flex items-center gap-3 text-xs text-emerald-400 font-semibold mb-1">
                <span>{activeMedia.category}</span>
                {activeMedia.date && <span>• {activeMedia.date}</span>}
              </div>
              <h3 className="text-lg font-bold text-white">{activeMedia.title}</h3>
              <p className="text-sm text-gray-300 mt-2 leading-relaxed">
                {activeMedia.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
