import React from 'react';
import { ShieldAlert, AlertTriangle, Coins, Store } from 'lucide-react';

interface StatsBannerProps {
  stats: {
    totalReportsCount: number;
    totalFraudCustomers: number;
    totalLossSaved: number;
    totalSellers: number;
  };
}

export const StatsBanner: React.FC<StatsBannerProps> = ({ stats }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-[11px] text-neutral-400 font-medium">চিহ্নিত ফ্রড নম্বর</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-black text-amber-300 font-mono tabular-nums">
              {stats.totalFraudCustomers}
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-400/60" />
          </div>
          <span className="text-[10px] text-neutral-500 mt-1">কালোতালিকাভুক্ত গ্রাহক</span>
        </div>

        <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-[11px] text-neutral-400 font-medium">মোট অভিযোগ ফিডব্যাক</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-black text-neutral-100 font-mono tabular-nums">
              {stats.totalReportsCount}
            </span>
            <ShieldAlert className="w-4 h-4 text-neutral-400/60" />
          </div>
          <span className="text-[10px] text-neutral-500 mt-1">সেলারদের দাখিলকৃত</span>
        </div>

        <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-[11px] text-neutral-400 font-medium">রিপোর্টেড কুরিয়ার লস</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-black text-rose-400 font-mono tabular-nums">
              ৳{stats.totalLossSaved.toLocaleString('en-US')}
            </span>
            <Coins className="w-4 h-4 text-rose-400/60" />
          </div>
          <span className="text-[10px] text-neutral-500 mt-1">পার্সেল রিটার্ন বাবদ ক্ষতি</span>
        </div>

        <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-[11px] text-neutral-400 font-medium">যুক্ত থাকা অনলাইন শপ</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono tabular-nums">
              {stats.totalSellers}+
            </span>
            <Store className="w-4 h-4 text-emerald-400/60" />
          </div>
          <span className="text-[10px] text-neutral-500 mt-1">এফ-কমার্স ও ই-কমার্স</span>
        </div>
      </div>
    </div>
  );
};
