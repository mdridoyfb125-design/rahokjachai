import React from 'react';
import { FraudFeedback } from '../types';
import { formatPhoneDisplay, getCategoryLabel } from '../utils/phoneUtils';
import { Store, Truck, Calendar, ArrowRight, ShieldAlert, Phone } from 'lucide-react';

interface RecentReportsListProps {
  reports: FraudFeedback[];
  onSelectCustomerPhone: (phone: string) => void;
}

export const RecentReportsList: React.FC<RecentReportsListProps> = ({
  reports,
  onSelectCustomerPhone,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-100 flex items-center gap-2">
            <span>অনলাইন বিক্রেতাদের সাম্প্রতিক অভিযোগ</span>
            <span className="yellow-highlight text-xs py-0.2">লাইভ ফিড</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            যেকোনো নম্বরে ক্লিক করে ওই গ্রাহকের সম্পূর্ণ পূর্ববর্তী হিস্ট্রি দেখুন
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {reports.slice(0, 10).map((rep) => (
          <div
            key={rep.id}
            onClick={() => onSelectCustomerPhone(rep.customerPhone)}
            className="group bg-neutral-900/90 border border-neutral-800 hover:border-amber-400/70 rounded-xl p-4 transition-all cursor-pointer shadow-sm hover:shadow-md"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-neutral-800/60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-amber-400 font-mono font-bold text-xs shrink-0 group-hover:bg-amber-400 group-hover:text-neutral-950 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-base text-neutral-100 group-hover:text-amber-300 transition-colors">
                      {formatPhoneDisplay(rep.customerPhone)}
                    </span>
                    <span className="text-xs text-neutral-400">
                      ({rep.customerName || 'গ্রাহকের নাম নেই'})
                    </span>
                  </div>
                  <div className="text-xs text-neutral-400 flex items-center gap-2 mt-0.5">
                    <span className="text-neutral-300 font-medium">রিপোর্টার: {rep.sellerShopName}</span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{rep.sellerPlatform}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
                <span className="text-rose-400 font-bold font-mono">
                  ক্ষতি: ৳{rep.lossAmount}
                </span>
                <span className="text-neutral-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(rep.createdAt).toLocaleDateString('bn-BD', { month: 'short', day: 'numeric' })}</span>
                </span>
                <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
              </div>
            </div>

            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-neutral-800 text-amber-300 border border-neutral-700">
                {getCategoryLabel(rep.category)}
              </span>
              {rep.courierService && (
                <span className="text-xs text-neutral-400 flex items-center gap-1">
                  <Truck className="w-3 h-3 text-neutral-500" />
                  {rep.courierService}
                </span>
              )}
            </div>

            <div className="mt-2.5 leading-relaxed sm:leading-[1.85]">
              <span className="text-highlighter-yellow text-xs sm:text-sm">
                "{rep.feedbackText}"
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
