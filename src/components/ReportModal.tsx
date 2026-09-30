import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, ShieldAlert, Check, Phone, User, MessageSquare } from 'lucide-react';
import { FraudCategory } from '../types';
import { normalizePhone, isValidBdPhone, formatPhoneDisplay } from '../utils/phoneUtils';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reportData: {
    customerPhone: string;
    customerName: string;
    sellerShopName: string;
    sellerPlatform: 'facebook' | 'instagram' | 'website' | 'daraz' | 'other';
    isVerifiedSeller?: boolean;
    category: FraudCategory;
    lossAmount: number;
    courierService: string;
    feedbackText: string;
    location?: string;
    orderNumber?: string;
  }) => void;
  initialPhone?: string;
  initialName?: string;
  isExistingCustomer?: boolean;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialPhone = '',
  initialName = '',
  isExistingCustomer = false,
}) => {
  const [customerPhone, setCustomerPhone] = useState(initialPhone);
  const [customerName, setCustomerName] = useState(initialName);
  const [sellerShopName, setSellerShopName] = useState('');
  const [category, setCategory] = useState<FraudCategory>('refused_delivery');
  const [courierService, setCourierService] = useState('Steadfast Courier');
  const [feedbackText, setFeedbackText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialPhone) {
      setCustomerPhone(initialPhone);
    }
    if (initialName) {
      setCustomerName(initialName);
    }
    setErrorMsg('');
    setIsSubmitting(false);
  }, [initialPhone, initialName, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setErrorMsg('');

    const normalized = normalizePhone(customerPhone);
    if (!normalized || normalized.length < 11) {
      setErrorMsg('সঠিক ১১ ডিজিটের কাস্টমার মোবাইল নম্বর প্রয়োজন (যেমন: 01712345678)');
      return;
    }

    if (!feedbackText.trim() || feedbackText.trim().length < 8) {
      setErrorMsg('অনুগ্রহ করে কাস্টমার সম্পর্কে আপনার ফিডব্যাক বা অভিজ্ঞতা বিস্তারিত লিখুন');
      return;
    }

    // For new full reports, validate seller shop name as well
    if (!isExistingCustomer && !sellerShopName.trim()) {
      setErrorMsg('আপনার শপ, ফেসবুক পেজ বা ওয়েবসাইটের নাম লিখুন');
      return;
    }

    setIsSubmitting(true);

    onSubmit({
      customerPhone: normalized,
      customerName: customerName.trim() || initialName.trim() || 'নাম উল্লেখ নেই',
      sellerShopName: sellerShopName.trim() || 'অনলাইন বিক্রেতা',
      sellerPlatform: 'facebook',
      isVerifiedSeller: true,
      category,
      lossAmount: 0,
      courierService: isExistingCustomer ? '' : courierService,
      location: '',
      orderNumber: '',
      feedbackText: feedbackText.trim(),
    });

    setFeedbackText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div 
        className="bg-neutral-900 border-t sm:border border-neutral-700 w-full max-w-xl rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200 flex flex-col max-h-[92vh] sm:max-h-[85vh]"
        role="dialog"
      >
        {/* Modal Header */}
        <div className="bg-neutral-950 px-4 sm:px-5 py-3.5 sm:py-4 border-b border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
              {isExistingCustomer ? <MessageSquare className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-neutral-100 flex items-center gap-2">
                <span>{isExistingCustomer ? 'কাস্টমার ফিডব্যাক প্রদান' : 'ফ্রড কাস্টমার রিপোর্ট'}</span>
                <span className="yellow-highlight text-[10px] sm:text-[11px] py-0.2">
                  {isExistingCustomer ? 'ফিডব্যাক' : 'সেলার অ্যালার্ট'}
                </span>
              </h2>
              <p className="text-[11px] text-neutral-400">
                {isExistingCustomer 
                  ? 'এই কাস্টমারের বিষয়ে আপনার অভিজ্ঞতা যোগ করুন'
                  : 'অন্যান্য ব্যবসায়ীদের ক্ষতি থেকে বাঁচাতে তথ্য শেয়ার করুন'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-100 p-2 rounded-lg hover:bg-neutral-800 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Scrollable Area */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* MODE A: EXISTING CUSTOMER (Just show mobile number and customer name, and ONLY a feedback box) */}
          {isExistingCustomer ? (
            <div className="space-y-3.5">
              {/* Customer Info Card: Mobile Number & Name Only */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 sm:p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] text-neutral-400 font-medium block mb-1">
                      কাস্টমারের মোবাইল নম্বর:
                    </span>
                    <div className="flex items-center gap-2 text-neutral-100 font-mono text-base font-bold">
                      <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{formatPhoneDisplay(customerPhone)}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-neutral-400 font-medium block mb-1">
                      কাস্টমারের নাম:
                    </span>
                    <div className="flex items-center gap-2 text-neutral-200 text-sm font-semibold">
                      <User className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{customerName || initialName || 'নাম উল্লেখ নেই'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ONLY A BOX FOR WRITING FEEDBACK */}
              <div>
                <label className="block text-xs font-semibold text-neutral-200 mb-1.5 flex items-center justify-between">
                  <span>আপনার অভিযোগ ও ফিডব্যাক <span className="text-rose-400">*</span></span>
                  <span className="text-[11px] text-neutral-500 font-normal">বিস্তারিত লিখুন</span>
                </label>
                <textarea
                  rows={5}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="এই কাস্টমার সম্পর্কে আপনার অভিজ্ঞতা লিখুন (যেমন: পার্সেল রিসিভ করেনি, ফোন বন্ধ রেখেছিল বা অযথা সময় নষ্ট করেছে...)"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-3 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 leading-relaxed min-h-[130px]"
                  required
                  autoFocus
                />
              </div>
            </div>
          ) : (
            /* MODE B: NEW CUSTOMER REPORT FORM */
            <div className="space-y-3.5">
              {/* Row 1: Fraud Customer Phone & Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-200 mb-1">
                    কাস্টমারের মোবাইল নম্বর <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-mono min-h-[44px]"
                    required
                  />
                  <p className="text-[10px] text-neutral-400 mt-0.5">বাংলা বা ইংরেজি সংখ্যা দিতে পারেন</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-200 mb-1">
                    কাস্টমারের নাম (যদি থাকে)
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="যেমন: তানভীর আহমেদ"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-amber-400 min-h-[44px]"
                  />
                </div>
              </div>

              {/* Row 2: Seller Shop Name */}
              <div>
                <label className="block text-xs font-semibold text-neutral-200 mb-1">
                  আপনার শপ বা পেজের নাম <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={sellerShopName}
                  onChange={(e) => setSellerShopName(e.target.value)}
                  placeholder="যেমন: স্টাইলিশ ফ্যাশন বিডি"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-amber-400 min-h-[44px]"
                  required
                />
              </div>

              {/* Row 3: Fraud Category & Courier */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-200 mb-1">
                    প্রতারণার ধরন / কারণ <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-400 min-h-[44px]"
                  >
                    <option value="refused_delivery">পার্সেল রিসিভ করেনি / রিটার্ন</option>
                    <option value="phone_switched_off">ফোন বন্ধ / কল রিসিভ করেনি</option>
                    <option value="delivery_charge_fraud">ডেলিভারি চার্জ না দিয়ে ব্লক</option>
                    <option value="fake_order">ফেক অর্ডার / ভুয়া ঠিকানা</option>
                    <option value="harassment_abusive">রাইডার বা পেজের সাথে দুর্ব্যবহার</option>
                    <option value="damaged_swapped_return">প্যাকেট খুলে বদলে রিটার্ন</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-200 mb-1">
                    ব্যবহৃত কুরিয়ার সার্ভিস
                  </label>
                  <select
                    value={courierService}
                    onChange={(e) => setCourierService(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-400 min-h-[44px]"
                  >
                    <option value="Steadfast Courier">Steadfast Courier</option>
                    <option value="Pathao Courier">Pathao Courier</option>
                    <option value="RedX">RedX</option>
                    <option value="Paperfly">Paperfly</option>
                    <option value="eCourier">eCourier</option>
                    <option value="Sundarban Courier">সুন্দরবন কুরিয়ার</option>
                    <option value="SA Paribahan">এস এ পরিবহন</option>
                    <option value="অন্যান্য">অন্যান্য কুরিয়ার</option>
                  </select>
                </div>
              </div>

              {/* Detailed Feedback Writing */}
              <div>
                <label className="block text-xs font-semibold text-neutral-200 mb-1">
                  বিস্তারিত অভিযোগ ও ফিডব্যাক <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={3}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="কি ঘটেছিল বিস্তারিত লিখুন (যেমন: পার্সেল পৌঁছানোর পর ফোন ধরেনি, হোয়াটসঅ্যাপে নক দিলে ব্লক করে দেয়...)"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-amber-400 leading-relaxed"
                  required
                />
              </div>
            </div>
          )}

          {/* Sticky Form Actions for Phone */}
          <div className="pt-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-3 sm:py-2 text-xs font-medium text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-lg transition-colors min-h-[44px] flex items-center justify-center cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-5 py-3 sm:py-2.5 text-xs sm:text-sm font-bold bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-950 rounded-lg transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 min-h-[44px]"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'দাখিল হচ্ছে...' : (isExistingCustomer ? 'ফিডব্যাক দাখিল করুন' : 'রিপোর্ট দাখিল করুন')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
