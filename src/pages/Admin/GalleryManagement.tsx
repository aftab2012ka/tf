import { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Video,
  Upload,
  Trash2,
  Edit2,
  Plus,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Loader2,
  X
} from 'lucide-react';
import {
  getAllGallery,
  addGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
} from '../../services/galleryService';
import { uploadMediaFile } from '../../firebase/storage';
import { GalleryItem } from '../../types';
import { useToast } from '../../context/ToastContext';

const DEFAULT_CATEGORIES = [
  'Education',
  'Computer Classes',
  'Tailoring',
  'Mehndi',
  'Seerat',
  'Programs',
  'Community Activities'
];

export default function GalleryManagement() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState(DEFAULT_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [mediaDate, setMediaDate] = useState(new Date().toISOString().slice(0, 10));
  const [published, setPublished] = useState(true);
  const [mediaUrlInput, setMediaUrlInput] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { showToast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAllGallery();
      setItems(data || []);
    } catch (err) {
      console.warn('Error loading gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (mediaType === 'photo' && !file.type.startsWith('image/')) {
        showToast('Please select a valid image file (JPG, PNG, WebP)', 'error');
        return;
      }
      if (mediaType === 'video' && !file.type.startsWith('video/')) {
        showToast('Please select a valid video file (MP4, WebM)', 'error');
        return;
      }
      setUploadFile(file);
    }
  };

  const handleSubmitNewItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = customCategory.trim() || category;

    if (!title.trim()) {
      showToast('Please enter a title', 'error');
      return;
    }

    let finalMediaUrl = mediaUrlInput.trim();

    setIsUploading(true);
    try {
      if (uploadFile) {
        setUploadProgress(10);
        try {
          finalMediaUrl = await uploadMediaFile(uploadFile, 'gallery', (percent) => {
            setUploadProgress(percent);
          });
        } catch (storageErr) {
          console.warn('Storage upload note:', storageErr);
          // Fallback to data URL for preview if storage bucket is not yet activated
          finalMediaUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(uploadFile);
          });
        }
      }

      if (!finalMediaUrl) {
        showToast('Please provide a media file or URL', 'error');
        setIsUploading(false);
        return;
      }

      const newId = await addGalleryItem({
        title: title.trim(),
        caption: caption.trim(),
        mediaType,
        mediaUrl: finalMediaUrl,
        category: finalCategory,
        date: mediaDate,
        published
      });

      showToast('Media item added to gallery', 'success');
      setIsAddModalOpen(false);
      resetForm();
      loadData();
    } catch (err) {
      showToast('Error saving gallery item', 'error');
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  const handleTogglePublish = async (item: GalleryItem) => {
    try {
      const nextPublished = !item.published;
      await updateGalleryItem(item.id, { published: nextPublished });
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, published: nextPublished } : i))
      );
      showToast(nextPublished ? 'Item published' : 'Item unpublished', 'info');
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      await updateGalleryItem(editingItem.id, editingItem);
      setItems((prev) =>
        prev.map((i) => (i.id === editingItem.id ? editingItem : i))
      );
      showToast('Gallery item updated', 'success');
      setEditingItem(null);
    } catch (err) {
      showToast('Error updating item', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteGalleryItem(deletingId);
      setItems((prev) => prev.filter((i) => i.id !== deletingId));
      showToast('Media item deleted', 'info');
      setDeletingId(null);
    } catch (err) {
      showToast('Failed to delete item', 'error');
    }
  };

  const resetForm = () => {
    setTitle('');
    setCaption('');
    setCategory(DEFAULT_CATEGORIES[0]);
    setCustomCategory('');
    setMediaUrlInput('');
    setUploadFile(null);
    setPublished(true);
    setUploadProgress(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-950 tracking-tight">
            Work Gallery Media
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Upload, categorize, publish, or remove photos and videos of Tuba Foundation's activities.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0e6245] hover:bg-[#0b4d36] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add Media Item</span>
        </button>
      </div>

      {/* Media Grid */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
        {loading ? (
          <div className="py-16 text-center text-xs text-gray-400">
            Loading media...
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center max-w-sm mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
              <ImageIcon className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-gray-800">No Media Items Yet</h4>
            <p className="text-xs text-gray-500">
              Click the "Add Media Item" button above to upload your first event photo or video.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden flex flex-col justify-between"
              >
                {/* Media Preview */}
                <div className="relative aspect-video bg-black flex items-center justify-center">
                  {item.mediaType === 'video' ? (
                    <video src={item.mediaUrl} className="w-full h-full object-cover" />
                  ) : (
                    <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover" />
                  )}

                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1">
                      {item.mediaType === 'video' ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                      {item.mediaType}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 text-[10px] font-semibold">
                      {item.category}
                    </span>
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    <button
                      onClick={() => handleTogglePublish(item)}
                      className={`p-1.5 rounded-md backdrop-blur-xs text-xs font-semibold ${
                        item.published
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-800/80 text-gray-300'
                      }`}
                      title={item.published ? 'Published (Click to hide)' : 'Unpublished (Click to publish)'}
                    >
                      {item.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2 flex-1">
                  <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <span>{item.date || 'No date'}</span>
                    <span className={item.published ? 'text-emerald-700 font-bold' : 'text-gray-400'}>
                      {item.published ? 'Live' : 'Draft'}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{item.title}</h4>
                  <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">{item.caption}</p>
                </div>

                {/* Actions */}
                <div className="p-3 border-t border-gray-200/80 bg-white flex items-center justify-between">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="text-xs text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => setDeletingId(item.id)}
                    className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Media Modal */}
      {isAddModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Add Gallery Media Item</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewItem} className="mt-5 space-y-4 text-xs">
              {/* Media Type */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Media Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMediaType('photo')}
                    className={`py-2 px-3 rounded-lg border font-semibold flex items-center justify-center gap-2 cursor-pointer ${
                      mediaType === 'photo'
                        ? 'border-[#0e6245] bg-emerald-50 text-[#0e6245]'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" /> Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaType('video')}
                    className={`py-2 px-3 rounded-lg border font-semibold flex items-center justify-center gap-2 cursor-pointer ${
                      mediaType === 'video'
                        ? 'border-[#0e6245] bg-emerald-50 text-[#0e6245]'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    <Video className="w-4 h-4" /> Video
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Computer Batch Inauguration 2026"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Caption */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Caption / Description
                </label>
                <textarea
                  rows={2}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Brief description of the activity or session..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Category & Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs"
                  >
                    {DEFAULT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="Custom">Custom Category...</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Date of Event
                  </label>
                  <input
                    type="date"
                    value={mediaDate}
                    onChange={(e) => setMediaDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs"
                  />
                </div>
              </div>

              {category === 'Custom' && (
                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Custom Category Name
                  </label>
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Enter custom category name"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs"
                  />
                </div>
              )}

              {/* Media File Upload or Direct URL */}
              <div className="space-y-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <label className="block font-bold uppercase tracking-wider text-gray-700">
                  Select File to Upload
                </label>
                <input
                  type="file"
                  accept={mediaType === 'photo' ? 'image/*' : 'video/*'}
                  onChange={handleFileSelect}
                  className="w-full text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#0e6245] file:text-white hover:file:bg-[#0b4d36] cursor-pointer"
                />

                <div className="text-[11px] text-gray-400 text-center uppercase tracking-wider">or provide direct media URL</div>

                <input
                  type="url"
                  value={mediaUrlInput}
                  onChange={(e) => setMediaUrlInput(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs bg-white"
                />
              </div>

              {uploadProgress !== null && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-gray-500">
                    <span>Uploading media...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[#0e6245] h-1.5 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Published switch */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="publishedCheckbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="rounded text-[#0e6245] focus:ring-emerald-600"
                />
                <label htmlFor="publishedCheckbox" className="font-semibold text-gray-800 cursor-pointer">
                  Publish to public gallery immediately
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-2 bg-[#0e6245] hover:bg-[#0b4d36] text-white rounded-lg font-bold flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Save Media</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setEditingItem(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100">
              Edit Media Details
            </h3>
            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Caption</label>
                <textarea
                  rows={2}
                  value={editingItem.caption}
                  onChange={(e) => setEditingItem({ ...editingItem, caption: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Media URL</label>
                <input
                  type="text"
                  value={editingItem.mediaUrl}
                  onChange={(e) => setEditingItem({ ...editingItem, mediaUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0e6245] hover:bg-[#0b4d36] text-white rounded-lg font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deletingId && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setDeletingId(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="text-base font-bold text-gray-900">Delete Media Item</h4>
              <p className="text-xs text-gray-500">
                Are you sure you want to remove this media item from the gallery?
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
