/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CustomerResult } from './components/CustomerResult';
import { ReportModal } from './components/ReportModal';
import { SellerSafetyTips } from './components/SellerSafetyTips';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { 
  getStoredReports, 
  saveReport, 
  deleteStoredReport,
  aggregateCustomerByPhone,
  aggregateFeedbackArray
} from './utils/storage';
import { 
  saveReportToFirestore, 
  subscribeToCustomerReports 
} from './firebase';
import { FraudFeedback, AggregatedCustomer } from './types';
import { CheckCircle2, Search, PlusCircle, Loader2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'search' | 'tips'>('search');
  const [searchedPhone, setSearchedPhone] = useState<string>('');
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [aggregatedCustomer, setAggregatedCustomer] = useState<AggregatedCustomer | null>(null);
  
  // Modal state
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [modalInitialPhone, setModalInitialPhone] = useState<string>('');
  const [modalInitialName, setModalInitialName] = useState<string>('');
  const [modalIsExistingCustomer, setModalIsExistingCustomer] = useState<boolean>(false);
  
  // Success notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Admin authentication and dashboard state
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(
    () => typeof window !== 'undefined' && sessionStorage.getItem('isAdminAuthenticated') === 'true'
  );
  const [showAdminPanel, setShowAdminPanel] = useState<boolean>(false);

  const handleAdminLogout = () => {
    sessionStorage.removeItem('isAdminAuthenticated');
    setIsAdminLoggedIn(false);
    setShowAdminPanel(false);
  };

  // Real-time Firestore subscription for searched phone
  useEffect(() => {
    if (!searchedPhone) return;

    setIsSearching(true);
    const unsubscribe = subscribeToCustomerReports(
      searchedPhone,
      (liveReports) => {
        setIsSearching(false);
        // Real-time Firestore data is the authoritative source
        const aggregated = aggregateFeedbackArray(searchedPhone, liveReports);
        setAggregatedCustomer(aggregated);

        // If Firestore has 0 reports for this phone, purge any stale local cache for this phone
        if (liveReports.length === 0) {
          deleteStoredReport(undefined, searchedPhone);
        }
      },
      (err) => {
        console.warn('Real-time connection error, using local fallback:', err);
        setIsSearching(false);
        const localResult = aggregateCustomerByPhone(searchedPhone);
        setAggregatedCustomer(localResult);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [searchedPhone]);

  const executeSearch = (phone: string) => {
    setSearchedPhone(phone);
    setHasSearched(true);
    setActiveTab('search');
  };

  const handleOpenReportModal = (
    prefillPhone = '',
    prefillName = '',
    isExistingCustomer = false
  ) => {
    setModalInitialPhone(prefillPhone);
    setModalInitialName(prefillName);
    setModalIsExistingCustomer(isExistingCustomer);
    setIsReportModalOpen(true);
  };

  const handleReportSubmit = async (data: any) => {
    let savedToFirestore = false;
    try {
      await saveReportToFirestore(data);
      savedToFirestore = true;
    } catch (err) {
      console.warn('Firestore write error, saving to local fallback:', err);
      // Only write to localStorage as offline fallback if Firestore fails
      saveReport(data);
    }

    // Show toast
    setToastMessage(
      modalIsExistingCustomer 
        ? 'সফলভাবে আপনার ফিডব্যাক যুক্ত করা হয়েছে!' 
        : 'সফলভাবে অভিযোগ দাখিল করা হয়েছে!'
    );
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);

    // Immediately search and listen to this number in real-time
    executeSearch(data.customerPhone);
  };

  // If admin panel is open and authenticated, display Admin Dashboard
  if (showAdminPanel && isAdminLoggedIn) {
    return (
      <AdminDashboard 
        onLogout={handleAdminLogout} 
        onClose={() => setShowAdminPanel(false)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-amber-300 selection:text-neutral-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-500 text-neutral-950 px-4 py-3 rounded-xl shadow-2xl font-bold text-xs sm:text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-neutral-950 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReportModal={() => handleOpenReportModal(searchedPhone || '')}
        totalReportsCount={0}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-28 sm:pb-16">
        {activeTab === 'search' && (
          <>
            {/* Search Input Bar */}
            <SearchBar
              onSearch={executeSearch}
              searchedPhone={searchedPhone}
            />

            {/* Loading indicator during search */}
            {isSearching && (
              <div className="flex items-center justify-center gap-2 my-6 text-xs text-amber-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>রিয়েলটাইম ডেটাবেজে অনুসন্ধান করা হচ্ছে...</span>
              </div>
            )}

            {/* Results Section ONLY SHOWN WHEN SEARCHED (No feedback automatically shown on homepage) */}
            {hasSearched ? (
              <CustomerResult
                customer={aggregatedCustomer}
                searchedPhone={searchedPhone}
                onOpenReportModalWithPhone={handleOpenReportModal}
              />
            ) : (
              /* Clean Minimal State before search - zero feedback displayed */
              <div className="max-w-2xl mx-auto px-4 mt-8 text-center">
                <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 sm:p-8">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center mb-3">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-neutral-100">
                    মোবাইল নম্বর লিখে <span className="yellow-highlight text-xs sm:text-sm py-0.5">যাচাই করুন</span> বাটনে চাপুন
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-md mx-auto">
                    কাস্টমারের পূর্ববর্তী কোনো ফ্রড বা পার্সেল রিটার্নের অভিযোগ থাকলে তা সার্চ করার পরেই এখানে সম্পূর্ণ দেখতে পাবেন।
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Tab 2: Safety Tips */}
        {activeTab === 'tips' && (
          <div className="pt-4">
            <SellerSafetyTips />
          </div>
        )}
      </main>

      {/* Report / Feedback Submission Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportSubmit}
        initialPhone={modalInitialPhone}
        initialName={modalInitialName}
        isExistingCustomer={modalIsExistingCustomer}
      />

      {/* Mobile-Only Bottom Navigation Bar for easy 1-thumb touch navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReportModal={() => handleOpenReportModal(searchedPhone || '')}
      />

      {/* Footer */}
      <footer className="border-t border-neutral-800/80 bg-neutral-950 py-6 text-center text-xs text-neutral-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-neutral-400 font-medium">
            <span>গ্রাহক</span>
            <span className="text-amber-400 font-bold">যাচাই</span>
            <span aria-hidden="true">·</span>
            <span>অনলাইন বিজনেস ফ্রড প্রতিরোধ</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[12px] text-emerald-400 font-medium">
              Made by Ridoy Mostofa
            </span>
            <span className="text-neutral-700">·</span>
            {/* Admin Login text format in footer */}
            <button
              type="button"
              onClick={() => {
                if (isAdminLoggedIn) {
                  setShowAdminPanel(true);
                } else {
                  setIsAdminLoginOpen(true);
                }
              }}
              className="text-neutral-500 hover:text-amber-400 transition-colors cursor-pointer bg-transparent border-none p-0 text-xs font-normal"
            >
              {isAdminLoggedIn ? 'অ্যাডমিন ড্যাশবোর্ড' : 'অ্যাডমিন লগইন'}
            </button>
          </div>
        </div>
      </footer>

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={() => {
          setIsAdminLoggedIn(true);
          setShowAdminPanel(true);
        }}
      />
    </div>
  );
}
