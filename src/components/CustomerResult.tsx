import React from 'react';
import { AggregatedCustomer, FraudFeedback } from '../types';
import { formatPhoneDisplay, getCategoryLabel } from '../utils/phoneUtils';
import { 
  AlertTriangle, 
  ShieldCheck, 
  Store, 
  Truck, 
  Calendar, 
  PlusCircle, 
  AlertOctagon,
  User,
  MessageSquare
} from 'lucide-react';

interface CustomerResultProps {
  customer: AggregatedCustomer | null;
  searchedPhone: string;
  onOpenReportModalWithPhone: (phone: string, customerName?: string, isExistingCustomer?: boolean) => void;
}

export const CustomerResult: React.FC<CustomerResultProps> = ({
  customer,
  searchedPhone,
  onOpenReportModalWithPhone,
}) => {
  // 1. NO DATA FOUND STATE
  if (!customer) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-4 sm:mt-6 px-3.5 sm:px-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-8 text-center shadow-lg">
          <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 sm:mb-4">
            <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>

          {/* Yellow Highlight Main Text */}
          <div className="mb-2 sm:mb-3">
            <span className="yellow-highlight text-sm sm:text-lg">
              কোনো পূর্ববর্তী অভিযোগ বা ফ্রড রেকর্ড পাওয়া যায়নি
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-neutral-100 font-mono tracking-wide mt-1">
            {formatPhoneDisplay(searchedPhone)}
          </h2>

          <p className="mt-2.5 text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto leading-relaxed">
            এই মোবাইল নম্বরের বিরুদ্ধে এখন পর্যন্ত অন্য কোনো অনলাইন বিক্রেতার পক্ষ থেকে কোনো নেতিবাচক ফিডব্যাক বা পার্সেল রিটার্নের অভিযোগ জমা পড়েনি।
          </p>

          <div className="mt-6 pt-5 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-center gap-3">
            <span className="text-xs text-neutral-400 text-center">
              আপনি কি এই কাস্টমারের কাছ থেকে কোনো প্রতারণার শিকার হয়েছেন?
            </span>
            <button
              onClick={() => onOpenReportModalWithPhone(searchedPhone, '', false)}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-amber-400/40 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap min-h-[44px]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>প্রথম অভিযোগটি দাখিল করুন</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. DATA FOUND STATE
  return (
    <div className="w-full max-w-4xl mx-auto mt-4 sm:mt-6 px-3.5 sm:px-4 space-y-4 sm:space-y-6">
      {/* Risk Alert Banner with Yellow Text Background for high focus */}
      <div className="bg-neutral-900 border-2 border-amber-400/80 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            {/* Main Headline with Yellow Highlight */}
            <div className="mb-2">
              <span className="yellow-highlight text-xs sm:text-base leading-tight">
                ⚠️ সতর্কতা: এই কাস্টমারের বিরুদ্ধে {customer.totalReports}টি শপের প্রতারণার অভিযোগ রয়েছে!
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1.5">
              <h2 className="text-xl sm:text-3xl font-extrabold text-neutral-100 font-mono tracking-tight">
                {formatPhoneDisplay(customer.phone)}
              </h2>
              {customer.totalReports >= 5 && (
                <span className="text-[11px] sm:text-xs font-bold px-2 py-0.5 sm:py-1 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center gap-1">
                  <AlertOctagon className="w-3.5 h-3.5 shrink-0" />
                  উচ্চ ঝুঁকিপূর্ণ (একাধিক অভিযোগ)
                </span>
              )}
            </div>

            {/* Names used by this fraud customer */}
            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-neutral-300">
              <User className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span className="text-neutral-400 font-medium">ব্যবহৃত নাম:</span>
              <span className="font-semibold text-neutral-100">
                {customer.names.join(', ') || 'নাম উল্লেখ নেই'}
              </span>
            </div>
          </div>

          {/* Aggregated Loss and Action */}
          <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-neutral-800">
            <div className="flex sm:flex-col items-baseline sm:items-start md:items-end justify-between w-full sm:w-auto gap-2">
              <span className="text-[11px] text-neutral-400 font-medium">
                {customer.totalLossAmount > 0 ? 'বিক্রেতাদের মোট ক্ষতি:' : 'মোট প্রাপ্ত অভিযোগ:'}
              </span>
              <div className="text-right">
                {customer.totalLossAmount > 0 ? (
                  <>
                    <span className="text-xl sm:text-2xl font-black text-rose-400 font-mono tabular-nums">
                      ৳{customer.totalLossAmount.toLocaleString('en-US')}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-neutral-400 block sm:inline sm:ml-1 md:block md:ml-0">
                      কুরিয়ার চার্জ বাবদ
                    </span>
                  </>
                ) : (
                  <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono tabular-nums">
                    {customer.totalReports} টি
                  </span>
                )}
              </div>
            </div>

            {/* Action buttons - phone optimized */}
            <div className="w-full sm:w-auto flex items-center justify-end">
              <button
                onClick={() => onOpenReportModalWithPhone(customer.phone, customer.names[0] || 'নাম উল্লেখ নেই', true)}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 active:scale-98 text-neutral-950 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer min-h-[44px] whitespace-nowrap shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>ফিডব্যাক দিন</span>
              </button>
            </div>
          </div>
        </div>

        {/* Couriers affected summary */}
        {customer.couriersUsed.length > 0 && (
          <div className="mt-3 pt-3 border-t border-neutral-800/80 flex flex-wrap items-center gap-1.5 text-xs text-neutral-400">
            <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-[11px] sm:text-xs">যেসব কুরিয়ারে রিটার্ন হয়েছে:</span>
            {customer.couriersUsed.map((courier, idx) => (
              <span key={idx} className="bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-medium border border-neutral-700">
                {courier}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ALL FEEDBACKS TIMELINE */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-amber-400 shrink-0" />
            <h3 className="text-sm sm:text-base font-bold text-neutral-100">
              সকল বিক্রেতার বিস্তারিত ফিডব্যাক ({customer.feedbacks.length}টি)
            </h3>
          </div>
        </div>

        <div className="space-y-3">
          {customer.feedbacks.map((report: FraudFeedback) => (
            <div 
              key={report.id}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-3.5 sm:p-5 hover:border-neutral-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-2.5 border-b border-neutral-800/60">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-amber-400 font-bold shrink-0 mt-0.5">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-neutral-100 text-sm sm:text-base">
                        {report.sellerShopName}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-400 flex flex-wrap items-center gap-1 mt-0.5">
                      <span>কাস্টমার: <strong className="text-neutral-300">{report.customerName || 'নাম নেই'}</strong></span>
                      {report.location && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{report.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:block text-left sm:text-right shrink-0 pt-1 sm:pt-0">
                  {report.lossAmount > 0 && (
                    <div className="text-xs font-semibold text-rose-400 font-mono">
                      ক্ষতি: ৳{report.lossAmount}
                    </div>
                  )}
                  <div className="text-xs text-neutral-400 flex items-center sm:justify-end gap-1 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{new Date(report.createdAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>

              {/* Main Focus: Line-by-Line Highlighted Feedback Text */}
              <div className="my-3.5 bg-neutral-950/70 border-l-4 border-amber-400 p-3.5 sm:p-4 rounded-r-xl border-y border-r border-neutral-800">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-2.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span>ওনারের ফিডব্যাক বিবরণ:</span>
                </div>
                <div className="text-lg sm:text-2xl font-bold leading-relaxed sm:leading-[2.1] select-text">
                  <span className="text-highlighter-yellow text-lg sm:text-2xl">
                    "{report.feedbackText}"
                  </span>
                </div>
              </div>

              {/* Feedback Category & Courier Meta Tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-neutral-800 text-amber-300 border border-neutral-700">
                  {getCategoryLabel(report.category)}
                </span>
                {report.courierService && (
                  <span className="text-xs text-neutral-400 flex items-center gap-1 bg-neutral-950/60 px-2.5 py-0.5 rounded border border-neutral-800">
                    <Truck className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    {report.courierService}
                  </span>
                )}
                {report.orderNumber && (
                  <span className="text-xs text-neutral-500 font-mono">
                    অর্ডার: {report.orderNumber}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
