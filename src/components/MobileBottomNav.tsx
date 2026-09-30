import React from 'react';
import { Search, PlusCircle, ShieldCheck } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'search' | 'tips';
  setActiveTab: (tab: 'search' | 'tips') => void;
  onOpenReportModal: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenReportModal,
}) => {
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-800 px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-2xl">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Tab 1: Search */}
        <button
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'search'
              ? 'text-amber-400 font-bold'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] leading-none">নম্বর সার্চ</span>
        </button>

        {/* Center Hero Action: Submit Report */}
        <button
          onClick={onOpenReportModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 active:bg-amber-300 text-neutral-950 font-black text-xs rounded-full shadow-lg active:scale-95 transition-all -translate-y-1 border-2 border-neutral-950 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-neutral-950" />
          <span>অভিযোগ দিন</span>
        </button>

        {/* Tab 2: Tips */}
        <button
          onClick={() => setActiveTab('tips')}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'tips'
              ? 'text-amber-400 font-bold'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[10px] leading-none">সুরক্ষা টিপস</span>
        </button>
      </div>
    </div>
  );
};
