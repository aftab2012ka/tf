import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Download,
  X,
  Check,
  AlertCircle,
  Phone,
  Calendar,
  CreditCard,
  FileSpreadsheet
} from 'lucide-react';
import {
  getParticipants,
  updateParticipantStatus,
  updateParticipant,
  deleteParticipant
} from '../../services/participantService';
import { SeeratParticipant } from '../../types';
import { useToast } from '../../context/ToastContext';

export default function ParticipantsManagement() {
  const [participants, setParticipants] = useState<SeeratParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('All');
  const [filterPaymentMode, setFilterPaymentMode] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const [selectedParticipant, setSelectedParticipant] = useState<SeeratParticipant | null>(null);
  const [editingParticipant, setEditingParticipant] = useState<SeeratParticipant | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { showToast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getParticipants();
      setParticipants(data || []);
    } catch (err) {
      console.warn('Error loading participants:', err);
      showToast('Could not load participants', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id: string, newStatus: SeeratParticipant['status']) => {
    try {
      await updateParticipantStatus(id, newStatus);
      setParticipants((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
      if (selectedParticipant?.id === id) {
        setSelectedParticipant((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
      showToast(`Status updated to ${newStatus}`, 'success');
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingParticipant) return;
    try {
      await updateParticipant(editingParticipant.id, editingParticipant);
      setParticipants((prev) =>
        prev.map((item) => (item.id === editingParticipant.id ? editingParticipant : item))
      );
      showToast('Participant updated', 'success');
      setEditingParticipant(null);
    } catch (err) {
      showToast('Error updating participant', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteParticipant(deletingId);
      setParticipants((prev) => prev.filter((item) => item.id !== deletingId));
      showToast('Participant record deleted', 'info');
      setDeletingId(null);
      if (selectedParticipant?.id === deletingId) {
        setSelectedParticipant(null);
      }
    } catch (err) {
      showToast('Failed to delete participant', 'error');
    }
  };

  // CSV Export
  const exportToCSV = () => {
    if (participants.length === 0) {
      showToast('No participants to export', 'info');
      return;
    }

    const headers = [
      'Registration ID',
      'Full Name',
      'Gender',
      'Age',
      'Qualification',
      'Current Study',
      'Marital Status',
      'Mobile',
      'Language',
      'Payment Mode',
      'Payment Reference',
      'Status',
      'Registered Date',
      'Address'
    ];

    const rows = filteredParticipants.map((p) => [
      p.registrationId,
      `"${p.fullName.replace(/"/g, '""')}"`,
      p.gender,
      p.age,
      `"${p.qualification.replace(/"/g, '""')}"`,
      `"${p.study.replace(/"/g, '""')}"`,
      p.marriageStatus,
      p.mobile,
      p.language,
      p.paymentMode,
      p.paymentReference || 'N/A',
      p.status,
      new Date(p.createdAt).toLocaleDateString(),
      `"${p.address.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Tuba_Foundation_Seerat_Participants_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Participants data exported to CSV', 'success');
  };

  const filteredParticipants = participants.filter((item) => {
    const matchesSearch =
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mobile.includes(searchTerm) ||
      item.registrationId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGender = filterGender === 'All' || item.gender === filterGender;
    const matchesPayment = filterPaymentMode === 'All' || item.paymentMode === filterPaymentMode;
    const matchesStatus = filterStatus === 'All' || item.status === filterStatus;

    return matchesSearch && matchesGender && matchesPayment && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header with Export CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-950 tracking-tight">
            Seerat & Program Participants
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Registered candidates for annual Seerat exam and educational workshops.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportToCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={loadData}
            className="px-3.5 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search name, phone, Reg ID..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
          />
        </div>

        <div>
          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 focus:ring-2 focus:ring-emerald-600"
          >
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <select
            value={filterPaymentMode}
            onChange={(e) => setFilterPaymentMode(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 focus:ring-2 focus:ring-emerald-600"
          >
            <option value="All">All Payment Modes</option>
            <option value="UPI">UPI</option>
            <option value="Cash">Cash</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 focus:ring-2 focus:ring-emerald-600"
          >
            <option value="All">All Statuses</option>
            <option value="Registered">Registered</option>
            <option value="Payment Pending">Payment Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Attended">Attended</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Participants Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400 text-xs">
            Loading participants...
          </div>
        ) : filteredParticipants.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-xs">
            No participants found matching the criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-700 uppercase tracking-wider font-bold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Reg ID</th>
                  <th className="py-3 px-4">Participant</th>
                  <th className="py-3 px-4">Study / Edu</th>
                  <th className="py-3 px-4">Mobile</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredParticipants.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-gray-900">
                      {p.registrationId}
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-900">
                      {p.fullName}
                      <span className="block text-[11px] font-normal text-gray-500">
                        {p.gender}, {p.age} yrs • {p.marriageStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-800">{p.study}</span>
                      <span className="block text-[11px] text-gray-500">{p.qualification}</span>
                    </td>
                    <td className="py-3 px-4">{p.mobile}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded bg-gray-100 font-semibold text-[10px]">
                        {p.paymentMode}
                      </span>
                      {p.paymentReference && (
                        <span className="block text-[10px] font-mono text-gray-400 mt-0.5">
                          Ref: {p.paymentReference}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={p.status}
                        onChange={(e) =>
                          handleStatusChange(p.id, e.target.value as SeeratParticipant['status'])
                        }
                        className="text-[11px] font-bold px-2 py-1 rounded-md border bg-white cursor-pointer"
                      >
                        <option value="Registered">Registered</option>
                        <option value="Payment Pending">Payment Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Attended">Attended</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedParticipant(p)}
                          className="p-1.5 rounded-md text-gray-500 hover:text-emerald-800 hover:bg-gray-100"
                          title="View Participant"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingParticipant(p)}
                          className="p-1.5 rounded-md text-gray-500 hover:text-blue-800 hover:bg-gray-100"
                          title="Edit Details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(p.id)}
                          className="p-1.5 rounded-md text-gray-400 hover:text-red-700 hover:bg-red-50"
                          title="Delete Record"
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

      {/* Details Modal */}
      {selectedParticipant && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedParticipant(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  Participant Card
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-1">
                  {selectedParticipant.fullName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedParticipant(null)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-3 text-xs text-gray-700">
              <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                <span className="text-gray-500 font-semibold">Registration ID:</span>
                <span className="font-mono font-bold text-gray-900">{selectedParticipant.registrationId}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-500 font-semibold block">Gender / Age:</span>
                  <span>{selectedParticipant.gender} / {selectedParticipant.age} yrs</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-500 font-semibold block">Marital Status:</span>
                  <span>{selectedParticipant.marriageStatus}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-500 font-semibold block">Qualification:</span>
                  <span>{selectedParticipant.qualification}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-500 font-semibold block">Current Study:</span>
                  <span>{selectedParticipant.study}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-500 font-semibold block">Payment Mode:</span>
                  <span className="font-bold text-gray-800">{selectedParticipant.paymentMode}</span>
                  {selectedParticipant.paymentReference && (
                    <span className="block text-[11px] font-mono text-gray-500">
                      Ref: {selectedParticipant.paymentReference}
                    </span>
                  )}
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-500 font-semibold block">Language:</span>
                  <span>{selectedParticipant.language}</span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-500 font-semibold block">Address:</span>
                <span>{selectedParticipant.address}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedParticipant(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingParticipant && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setEditingParticipant(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100">
              Edit Participant Record
            </h3>
            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingParticipant.fullName}
                  onChange={(e) => setEditingParticipant({ ...editingParticipant, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Mobile</label>
                  <input
                    type="text"
                    required
                    value={editingParticipant.mobile}
                    onChange={(e) => setEditingParticipant({ ...editingParticipant, mobile: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Status</label>
                  <select
                    value={editingParticipant.status}
                    onChange={(e) => setEditingParticipant({ ...editingParticipant, status: e.target.value as SeeratParticipant['status'] })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  >
                    <option value="Registered">Registered</option>
                    <option value="Payment Pending">Payment Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Attended">Attended</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingParticipant(null)}
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
              <h4 className="text-base font-bold text-gray-900">Confirm Record Deletion</h4>
              <p className="text-xs text-gray-500">
                Are you sure you want to delete this participant?
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
