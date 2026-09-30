import React from 'react';
import { ShieldAlert, PlusCircle, Search, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  activeTab: 'search' | 'tips';
  setActiveTab: (tab: 'search' | 'tips') => void;
  onOpenReportModal: () => void;
  totalReportsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenReportModal,
}) => {
  return (
    <header className="border-b border-neutral-800 bg-neutral-950/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-3.5 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
        {/* Zone 1: Wordmark */}
        <div 
          onClick={() => setActiveTab('search')}
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-amber-400 flex items-center justify-center text-neutral-950 font-black shadow-sm group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-black text-neutral-100 flex items-center gap-1 leading-tight tracking-tight">
              <span>গ্রাহক</span>
              <span className="text-amber-400">যাচাই</span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-neutral-400 leading-none mt-0.5">
              অনলাইন ফ্রড কাস্টমার ডিটেক্টর
            </p>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Hidden on small mobile, handled by thumb bar below) */}
        <nav className="hidden sm:flex items-center gap-2 text-sm font-medium">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors whitespace-nowrap text-xs sm:text-sm cursor-pointer ${
              activeTab === 'search'
                ? 'bg-neutral-800 text-amber-300 font-semibold shadow-inner'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>নম্বর সার্চ</span>
          </button>

          <button
            onClick={() => setActiveTab('tips')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors whitespace-nowrap text-xs sm:text-sm cursor-pointer ${
              activeTab === 'tips'
                ? 'bg-neutral-800 text-amber-300 font-semibold shadow-inner'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ডেলিভারি সুরক্ষা টিপস</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-2">
          {/* Desktop Button */}
          <button
            onClick={onOpenReportModal}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 active:scale-95 transition-all rounded-lg shadow-sm whitespace-nowrap cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>অভিযোগ দাখিল করুন</span>
          </button>

          {/* Phone-optimized compact header button */}
          <button
            onClick={onOpenReportModal}
            className="sm:hidden flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 active:scale-95 transition-all rounded-md shadow-sm whitespace-nowrap cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ অভিযোগ</span>
          </button>
        </div>
      </div>
    </header>
  );
};
