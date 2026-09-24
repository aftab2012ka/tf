import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  X,
  Check,
  AlertCircle,
  Clock,
  Phone,
  Mail,
  MapPin,
  Calendar,
  BookOpen
} from 'lucide-react';
import {
  getAdmissions,
  updateAdmissionStatus,
  updateAdmission,
  deleteAdmission
} from '../../services/admissionService';
import { AdmissionApplication } from '../../types';
import { useToast } from '../../context/ToastContext';
import { COURSES } from '../../data/courses';

export default function AdmissionsManagement() {
  const [admissions, setAdmissions] = useState<AdmissionApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const [selectedApplication, setSelectedApplication] = useState<AdmissionApplication | null>(null);
  const [editingApplication, setEditingApplication] = useState<AdmissionApplication | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { showToast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAdmissions();
      setAdmissions(data || []);
    } catch (err) {
      console.warn('Error loading admissions:', err);
      showToast('Could not load admissions', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id: string, newStatus: AdmissionApplication['status']) => {
    try {
      await updateAdmissionStatus(id, newStatus);
      setAdmissions((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
      if (selectedApplication?.id === id) {
        setSelectedApplication((prev) => prev ? { ...prev, status: newStatus } : null);
      }
      showToast(`Status updated to ${newStatus}`, 'success');
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApplication) return;

    try {
      await updateAdmission(editingApplication.id, editingApplication);
      setAdmissions((prev) =>
        prev.map((item) => (item.id === editingApplication.id ? editingApplication : item))
      );
      showToast('Application updated successfully', 'success');
      setEditingApplication(null);
    } catch (err) {
      showToast('Error updating application', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteAdmission(deletingId);
      setAdmissions((prev) => prev.filter((item) => item.id !== deletingId));
      showToast('Application deleted', 'info');
      setDeletingId(null);
      if (selectedApplication?.id === deletingId) {
        setSelectedApplication(null);
      }
    } catch (err) {
      showToast('Failed to delete application', 'error');
    }
  };

  const filteredAdmissions = admissions.filter((item) => {
    const matchesSearch =
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mobile.includes(searchTerm) ||
      item.applicationId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCourse = filterCourse === 'All' || item.course === filterCourse;
    const matchesStatus = filterStatus === 'All' || item.status === filterStatus;

    return matchesSearch && matchesCourse && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-950 tracking-tight">
            Admission Applications
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Review, update status, and manage all student course enrollments.
          </p>
        </div>
        <button
          onClick={loadData}
          className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors w-fit"
        >
          Refresh List
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, mobile, or Application ID..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
          />
        </div>

        {/* Filter Course */}
        <div className="w-full md:w-48">
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 focus:ring-2 focus:ring-emerald-600"
          >
            <option value="All">All Courses</option>
            {COURSES.map((c) => (
              <option key={c.id} value={c.title}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Status */}
        <div className="w-full md:w-40">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 focus:ring-2 focus:ring-emerald-600"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Reviewing">Reviewing</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400 text-xs">
            Loading admissions...
          </div>
        ) : filteredAdmissions.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-xs">
            No applications match the search or filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-700 uppercase tracking-wider font-bold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Application ID</th>
                  <th className="py-3 px-4">Applicant Name</th>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">Mobile</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Submitted On</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAdmissions.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-gray-900">
                      {app.applicationId}
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-900">
                      {app.fullName}
                      <span className="block text-[11px] font-normal text-gray-500">
                        {app.gender}, {app.age} yrs • {app.qualification}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-emerald-900">
                      {app.course}
                    </td>
                    <td className="py-3 px-4">{app.mobile}</td>
                    <td className="py-3 px-4">
                      <select
                        value={app.status}
                        onChange={(e) =>
                          handleStatusChange(app.id, e.target.value as AdmissionApplication['status'])
                        }
                        className={`text-[11px] font-bold px-2 py-1 rounded-md border cursor-pointer ${
                          app.status === 'New'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : app.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : app.status === 'Reviewing'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : app.status === 'Rejected'
                            ? 'bg-red-50 text-red-800 border-red-200'
                            : 'bg-gray-50 text-gray-800 border-gray-200'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Reviewing">Reviewing</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedApplication(app)}
                          className="p-1.5 rounded-md text-gray-500 hover:text-emerald-800 hover:bg-gray-100"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingApplication(app)}
                          className="p-1.5 rounded-md text-gray-500 hover:text-blue-800 hover:bg-gray-100"
                          title="Edit Details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(app.id)}
                          className="p-1.5 rounded-md text-gray-400 hover:text-red-700 hover:bg-red-50"
                          title="Delete Application"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal / Drawer */}
      {selectedApplication && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedApplication(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  Application Details
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-1">
                  {selectedApplication.fullName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedApplication(null)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-3.5 text-xs text-gray-700">
              <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                <span className="text-gray-500 font-semibold">Application ID:</span>
                <span className="font-mono font-bold text-gray-900">{selectedApplication.applicationId}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-500 font-semibold block">Course:</span>
                  <span className="font-bold text-emerald-950">{selectedApplication.course}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-500 font-semibold block">Status:</span>
                  <span className="font-bold text-gray-900">{selectedApplication.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-500 font-semibold block">Gender / Age:</span>
                  <span>{selectedApplication.gender} / {selectedApplication.age} years</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-500 font-semibold block">Qualification:</span>
                  <span>{selectedApplication.qualification}</span>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg space-y-1">
                <span className="text-gray-500 font-semibold block">Contact:</span>
                <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-400" /> {selectedApplication.mobile}</div>
                {selectedApplication.email && (
                  <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gray-400" /> {selectedApplication.email}</div>
                )}
              </div>

              <div className="p-3 bg-gray-50 rounded-lg space-y-1">
                <span className="text-gray-500 font-semibold block">Residential Address:</span>
                <div className="flex items-start gap-1.5 leading-relaxed">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                  <span>{selectedApplication.address}</span>
                </div>
              </div>

              {selectedApplication.message && (
                <div className="p-3 bg-gray-50 rounded-lg space-y-1">
                  <span className="text-gray-500 font-semibold block">Applicant Note / Inquiry:</span>
                  <p className="italic text-gray-600 leading-relaxed">{selectedApplication.message}</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedApplication(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingApplication && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setEditingApplication(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100">
              Edit Admission Record
            </h3>
            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingApplication.fullName}
                  onChange={(e) => setEditingApplication({ ...editingApplication, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Course</label>
                <select
                  value={editingApplication.course}
                  onChange={(e) => setEditingApplication({ ...editingApplication, course: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300"
                >
                  {COURSES.map((c) => (
                    <option key={c.id} value={c.title}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Mobile</label>
                  <input
                    type="text"
                    required
                    value={editingApplication.mobile}
                    onChange={(e) => setEditingApplication({ ...editingApplication, mobile: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Status</label>
                  <select
                    value={editingApplication.status}
                    onChange={(e) => setEditingApplication({ ...editingApplication, status: e.target.value as AdmissionApplication['status'] })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  >
                    <option value="New">New</option>
                    <option value="Reviewing">Reviewing</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Address</label>
                <textarea
                  rows={2}
                  value={editingApplication.address}
                  onChange={(e) => setEditingApplication({ ...editingApplication, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingApplication(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
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

      {/* Delete Confirmation Alert */}
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
              <h4 className="text-base font-bold text-gray-900">Confirm Permanent Deletion</h4>
              <p className="text-xs text-gray-500">
                Are you sure you want to delete this admission application? This action cannot be reversed.
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
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
