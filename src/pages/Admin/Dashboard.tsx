import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  Image as ImageIcon,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Video
} from 'lucide-react';
import { getAdmissions } from '../../services/admissionService';
import { getParticipants } from '../../services/participantService';
import { getAllGallery } from '../../services/galleryService';
import { AdmissionApplication, SeeratParticipant, GalleryItem } from '../../types';

export default function Dashboard() {
  const [admissions, setAdmissions] = useState<AdmissionApplication[]>([]);
  const [participants, setParticipants] = useState<SeeratParticipant[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [admData, partData, galData] = await Promise.all([
          getAdmissions().catch(() => []),
          getParticipants().catch(() => []),
          getAllGallery().catch(() => []),
        ]);
        setAdmissions(admData || []);
        setParticipants(partData || []);
        setGallery(galData || []);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center text-gray-500">
        <div className="w-8 h-8 border-2 border-[#0e6245] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Admissions Metrics
  const totalAdmissions = admissions.length;
  const newAdmissions = admissions.filter((a) => a.status === 'New').length;
  const pendingAdmissions = admissions.filter((a) => a.status === 'Reviewing').length;
  const approvedAdmissions = admissions.filter((a) => a.status === 'Approved').length;
  const rejectedAdmissions = admissions.filter((a) => a.status === 'Rejected').length;

  // Seerat Metrics
  const totalParticipants = participants.length;
  const newRegistrations = participants.filter((p) => p.status === 'Registered').length;
  const confirmedParticipants = participants.filter((p) => p.status === 'Confirmed').length;
  const pendingPaymentParticipants = participants.filter((p) => p.status === 'Payment Pending').length;

  // Gallery Metrics
  const totalPhotos = gallery.filter((g) => g.mediaType === 'photo').length;
  const totalVideos = gallery.filter((g) => g.mediaType === 'video').length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-950 tracking-tight">
          Executive Dashboard
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Real-time summary of course admissions, participant registrations, and media gallery.
        </p>
      </div>

      {/* Primary Section Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Admissions Summary Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Course Admissions
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0e6245] flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>

            <div>
              <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
                {totalAdmissions}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Total candidate applications</p>
            </div>

            {/* Breakdown */}
            <div className="pt-3 border-t border-gray-100 space-y-2 text-xs">
              <div className="flex items-center justify-between text-gray-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-blue-500" /> New Applications:
                </span>
                <span className="font-bold text-gray-900">{newAdmissions}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Under Review:
                </span>
                <span className="font-bold text-gray-900">{pendingAdmissions}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Approved:
                </span>
                <span className="font-bold text-gray-900">{approvedAdmissions}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-red-500" /> Rejected:
                </span>
                <span className="font-bold text-gray-900">{rejectedAdmissions}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-100">
            <Link
              to="/admin/admissions"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0e6245] hover:text-[#0b4d36]"
            >
              <span>Manage Admissions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Seerat Participants Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Seerat Participants
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0e6245] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div>
              <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
                {totalParticipants}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Total registered candidates</p>
            </div>

            {/* Breakdown */}
            <div className="pt-3 border-t border-gray-100 space-y-2 text-xs">
              <div className="flex items-center justify-between text-gray-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-blue-500" /> New Registrations:
                </span>
                <span className="font-bold text-gray-900">{newRegistrations}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Confirmed:
                </span>
                <span className="font-bold text-gray-900">{confirmedParticipants}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Payment Pending:
                </span>
                <span className="font-bold text-gray-900">{pendingPaymentParticipants}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-100">
            <Link
              to="/admin/participants"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0e6245] hover:text-[#0b4d36]"
            >
              <span>Manage Participants</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Gallery Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Work Gallery Media
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0e6245] flex items-center justify-center">
                <ImageIcon className="w-5 h-5" />
              </div>
            </div>

            <div>
              <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
                {gallery.length}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Total media records</p>
            </div>

            {/* Breakdown */}
            <div className="pt-3 border-t border-gray-100 space-y-2 text-xs">
              <div className="flex items-center justify-between text-gray-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <ImageIcon className="w-3.5 h-3.5 text-gray-500" /> Total Photos:
                </span>
                <span className="font-bold text-gray-900">{totalPhotos}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <Video className="w-3.5 h-3.5 text-gray-500" /> Total Videos:
                </span>
                <span className="font-bold text-gray-900">{totalVideos}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-100">
            <Link
              to="/admin/gallery"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0e6245] hover:text-[#0b4d36]"
            >
              <span>Manage Media Gallery</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Admissions Quick Table */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">Recent Applications</h2>
            <p className="text-xs text-gray-500">Latest admission submissions</p>
          </div>
          <Link
            to="/admin/admissions"
            className="text-xs font-semibold text-[#0e6245] hover:underline"
          >
            View All
          </Link>
        </div>

        {admissions.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-400">
            No admission applications recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-y border-gray-100">
                <tr>
                  <th className="py-2.5 px-3">Application ID</th>
                  <th className="py-2.5 px-3">Applicant Name</th>
                  <th className="py-2.5 px-3">Course</th>
                  <th className="py-2.5 px-3">Mobile</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {admissions.slice(0, 5).map((adm) => (
                  <tr key={adm.id} className="hover:bg-gray-50/50">
                    <td className="py-2.5 px-3 font-mono font-medium text-gray-900">{adm.applicationId}</td>
                    <td className="py-2.5 px-3 font-semibold text-gray-800">{adm.fullName}</td>
                    <td className="py-2.5 px-3">{adm.course}</td>
                    <td className="py-2.5 px-3">{adm.mobile}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                        {adm.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
