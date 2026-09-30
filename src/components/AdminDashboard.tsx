import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  LogOut, 
  Trash2, 
  Users, 
  FileText, 
  Phone, 
  Store, 
  Calendar, 
  Loader2, 
  AlertTriangle,
  Radio,
  Search
} from 'lucide-react';
import { FraudFeedback } from '../types';
import { subscribeAllReports, deleteReportFromFirestore } from '../firebase';
import { formatPhoneDisplay, getCategoryLabel } from '../utils/phoneUtils';
import { deleteStoredReport } from '../utils/storage';

interface AdminDashboardProps {
  onLogout: () => void;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onClose }) => {
  const [reports, setReports] = useState<FraudFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Real-time Firestore subscription
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeAllReports(
      (liveReports) => {
        setReports(liveReports);
        setLoading(false);
      },
      (error) => {
        console.error('Realtime admin listener error:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleDelete = async (report: FraudFeedback) => {
    const confirmed = window.confirm(`আপনি কি নিশ্চিত যে "${report.sellerShopName}"-এর এই রিপোর্টটি ডিলিট করতে চান?`);
    if (!confirmed) return;

    try {
      setDeletingId(report.id);
      // 1. Delete from Firestore real-time database
      await deleteReportFromFirestore(report.id);
      // 2. Also ensure local browser cache is cleared
      deleteStoredReport(report.id, report.customerPhone, report.feedbackText);

      setToastMsg('রিপোর্টটি সফলভাবে ডিলিট করা হয়েছে।');
      setTimeout(() => setToastMsg(null), 3500);
    } catch (err) {
      console.error('Delete error:', err);
      // Even if Firestore was already removed, clear local cache
      deleteStoredReport(report.id, report.customerPhone, report.feedbackText);
      alert('রিপোর্ট ডিলিট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setDeletingId(null);
    }
  };

  // Metrics
  const totalReportsCount = reports.length;
  const uniqueOwners = new Set(
    reports.map((r) => r.sellerShopName.trim().toLowerCase()).filter(Boolean)
  );
  const totalOwnersCount = uniqueOwners.size;

  // Filtered reports for admin search
  const filteredReports = reports.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      r.customerPhone.includes(q) ||
      (r.customerName && r.customerName.toLowerCase().includes(q)) ||
      (r.sellerShopName && r.sellerShopName.toLowerCase().includes(q)) ||
      (r.feedbackText && r.feedbackText.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      {/* Admin Top Navigation */}
      <header className="border-b border-neutral-800 bg-neutral-900/90 backdrop-blur sticky top-0 z-40 px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-neutral-950 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold text-neutral-100 tracking-tight">
                অ্যাডমিন ড্যাশবোর্ড
              </h1>
              <span className="flex items-center gap-1 text-[11px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-medium">
                <Radio className="w-3 h-3 animate-pulse" />
                <span>রিয়েলটাইম লাইভ</span>
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">সকল ফ্রড রিপোর্ট ও ওনার ফিডব্যাক মনিটরিং</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg transition-colors cursor-pointer"
          >
            <span>মূল পেজে যান</span>
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-400 hover:text-white bg-rose-950/40 hover:bg-rose-900 border border-rose-800/60 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>লগআউট</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Toast Alert */}
        {toastMsg && (
          <div className="bg-emerald-950/90 border border-emerald-700 text-emerald-200 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium animate-in fade-in flex items-center justify-between">
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Real-time Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Total Reports Submitted */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-medium text-neutral-400 block">মোট দাখিলকৃত রিপোর্ট</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-neutral-100 font-mono">
                  {totalReportsCount}
                </span>
                <span className="text-xs text-neutral-500">টি রিপোর্ট</span>
              </div>
            </div>
          </div>

          {/* Card 2: Total Reporting Owners */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-medium text-neutral-400 block">মোট রিপোর্টিং ওনার / শপ সংখ্যা</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-neutral-100 font-mono">
                  {totalOwnersCount}
                </span>
                <span className="text-xs text-neutral-500">জন ভিন্ন ওনার</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section Header & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-neutral-200">
              দাখিলকৃত সকল রিপোর্ট ও ফিডব্যাক তালিকা ({filteredReports.length})
            </h2>
            <p className="text-xs text-neutral-400">যে কোনো রিপোর্ট সরাসরি ডিলিট করতে পারেন</p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="মোবাইল বা শপের নাম খুঁজুন..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Reports List */}
        {loading ? (
          <div className="p-12 text-center text-neutral-400 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
            <span className="text-xs">রিয়েলটাইম ডেটা লোড হচ্ছে...</span>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-8 text-center text-neutral-400">
            <AlertTriangle className="w-8 h-8 mx-auto text-neutral-600 mb-2" />
            <p className="text-sm font-medium">কোনো রিপোর্ট পাওয়া যায়নি।</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-4 sm:p-5 transition-all space-y-3"
              >
                {/* Top Info Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-neutral-800/80">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1.5 font-mono text-base font-bold text-amber-300">
                      <Phone className="w-4 h-4 text-amber-400" />
                      {formatPhoneDisplay(report.customerPhone)}
                    </span>
                    <span className="text-xs text-neutral-400">
                      (কাস্টমার: <strong className="text-neutral-200">{report.customerName || 'নাম নেই'}</strong>)
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                      {getCategoryLabel(report.category)}
                    </span>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(report)}
                    disabled={deletingId === report.id}
                    className="self-end sm:self-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-400 hover:text-white bg-rose-950/40 hover:bg-rose-600 border border-rose-800/60 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {deletingId === report.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                    <span>মুছে ফেলুন (Delete)</span>
                  </button>
                </div>

                {/* Reporter Shop & Date */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400">
                  <div className="flex items-center gap-1.5 text-neutral-300 font-medium">
                    <Store className="w-3.5 h-3.5 text-amber-400" />
                    <span>রিপোর্টিং ওনার: <strong>{report.sellerShopName}</strong></span>
                  </div>
                  <div className="flex items-center gap-1 text-neutral-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {new Date(report.createdAt).toLocaleString('bn-BD', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {/* Highlighted Feedback Text */}
                <div className="bg-neutral-950/70 border-l-4 border-amber-400 p-3 sm:p-4 rounded-r-xl border-y border-r border-neutral-800">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-1.5">
                    ওনারের ফিডব্যাক বিবরণ:
                  </div>
                  <div className="text-base sm:text-lg font-bold leading-relaxed sm:leading-[1.9] select-text">
                    <span className="text-highlighter-yellow text-sm sm:text-base">
                      "{report.feedbackText}"
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
