import React, { useState } from 'react';
import { Search, Phone, ArrowRight, X, AlertCircle } from 'lucide-react';
import { normalizePhone, isValidBdPhone } from '../utils/phoneUtils';

interface SearchBarProps {
  onSearch: (phone: string) => void;
  searchedPhone: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, searchedPhone }) => {
  const [inputVal, setInputVal] = useState(searchedPhone);
  const [errorMsg, setErrorMsg] = useState('');

  const handleExecuteSearch = (phoneToSearch: string) => {
    setErrorMsg('');
    const normalized = normalizePhone(phoneToSearch);
    if (!normalized) {
      setErrorMsg('অনুগ্রহ করে কাস্টমারের ১১ ডিজিটের মোবাইল নম্বরটি লিখুন।');
      return;
    }
    if (normalized.length < 11) {
      setErrorMsg('নম্বরটি অসম্পূর্ণ। বাংলাদেশের সঠিক ১১ ডিজিটের নম্বর লিখুন (যেমন: 01712345678)।');
      return;
    }
    if (!isValidBdPhone(normalized)) {
      setErrorMsg('সঠিক বাংলাদেশি মোবাইল অপারেটরের নম্বর দিন (013, 014, 015, 016, 017, 018, 019)।');
      return;
    }
    onSearch(normalized);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleExecuteSearch(inputVal);
  };

  const handleClear = () => {
    setInputVal('');
    setErrorMsg('');
  };

  return (
    <div className="w-full max-w-3xl mx-auto text-center pt-6 sm:pt-8 pb-3 sm:pb-4 px-3.5 sm:px-4">
      {/* Main Focus Headline with Yellow Text Background Highlight */}
      <div className="mb-3 sm:mb-4">
        <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-neutral-100 tracking-tight leading-snug">
          পার্সেল পাঠানোর আগেই কাস্টমার{' '}
          <span className="yellow-highlight shadow-sm">
            ফ্রড বা ভুয়া কিনা
          </span>{' '}
          যাচাই করুন
        </h1>
        <p className="mt-2 text-xs sm:text-base text-neutral-400 max-w-xl mx-auto leading-relaxed">
          কাস্টমার অর্ডার দেওয়ার পর রিসিভ না করায়{' '}
          <span className="text-amber-300 font-semibold underline decoration-amber-400/40">
            কুরিয়ার রিটার্ন ক্ষতি
          </span>{' '}
          ঠেকাতে মোবাইল নম্বর দিয়ে পূর্ববর্তী অভিযোগ সার্চ করুন।
        </p>
      </div>

      {/* Main Search Input Form - Phone-optimized */}
      <form onSubmit={handleSubmit} className="mt-4 sm:mt-6 relative">
        <div className="flex flex-col sm:flex-row items-stretch gap-2 bg-neutral-900 p-1.5 sm:p-2 rounded-xl border-2 border-neutral-700 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20 shadow-xl transition-all">
          <div className="flex-1 flex items-center px-2.5 sm:px-3 gap-2 min-h-[44px]">
            <Phone className="w-5 h-5 text-neutral-400 shrink-0" />
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={inputVal}
              onChange={(e) => {
                setInputVal(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="017XXXXXXXX বা মোবাইল নম্বর লিখুন..."
              className="w-full bg-transparent text-neutral-100 placeholder:text-neutral-500 text-base sm:text-lg focus:outline-none font-medium"
              autoFocus
            />
            {inputVal && (
              <button
                type="button"
                onClick={handleClear}
                className="text-neutral-400 hover:text-neutral-200 p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-md"
                aria-label="মুছে ফেলুন"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 bg-amber-400 hover:bg-amber-300 active:scale-98 text-neutral-950 font-bold rounded-lg transition-all cursor-pointer text-sm sm:text-base shadow-md whitespace-nowrap min-h-[46px]"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>যাচাই করুন</span>
            <ArrowRight className="w-4 h-4 hidden sm:inline-block" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-2.5 flex items-center justify-center gap-1.5 text-xs text-rose-400 font-medium bg-rose-950/40 border border-rose-800/60 py-2 px-3 rounded-md text-left sm:text-center">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </form>
    </div>
  );
};
