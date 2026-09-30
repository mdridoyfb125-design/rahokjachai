import React from 'react';
import { ShieldCheck, PhoneCall, DollarSign, MapPin, AlertTriangle } from 'lucide-react';

export const SellerSafetyTips: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-neutral-100 flex items-center gap-2">
          <span>অনলাইন সেলারদের কুরিয়ার লস রোধের নির্দেশিকা</span>
          <span className="yellow-highlight text-xs py-0.2">জরুরি টিপস</span>
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          ক্যাশ অন ডেলিভারিতে পার্সেল রিটার্ন অনুপাত ১৫% থেকে ২%-এ নামিয়ে আনার কৌশল
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4.5">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-neutral-100 text-sm">
              ১. অগ্রিম ডেলিভারি চার্জ নিশ্চিত করুন
            </h3>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            নতুন বা ঢাকার বাইরের কাস্টমারদের ক্ষেত্রে অন্তত ডেলিভারি চার্জ (১০০-১৫০ টাকা) অগ্রিম বিকাশ/নগদে গ্রহণ করুন। যে গ্রাহক আসল তিনি কখনোই ১০০ টাকা দিতে দ্বিধা করবেন না; ভুয়া অর্ডারকারীরা সাথে সাথে সরে যাবে।
          </p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4.5">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center">
              <PhoneCall className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-neutral-100 text-sm">
              ২. কল কনফার্মেশন প্রটোকল
            </h3>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            ইনবক্সে শুধু মেসেজ পেয়েই পার্সেল বুক করবেন না। পাঠানোর আগে ফোনে কথা বলে সাইজ, কালার ও ঠিকানা পুনরায় মিলিয়ে নিন। ফোন রিসিভ না করলে বা বন্ধ থাকলে কখনই পার্সেল কুরিয়ারে দিবেন না।
          </p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4.5">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-neutral-100 text-sm">
              ৩. অসম্পূর্ণ ঠিকানায় সতর্কতা
            </h3>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            যদি গ্রাহক শুধু "মিরপুর" বা "সিলেট সদর" লিখে দেয় কিন্তু বাড়ি নম্বর, রোড নম্বর বা পরিচিত ল্যান্ডমার্ক না দেয়, তবে নিশ্চিতভাবে বিস্তারিত জেনে নিন। অসম্পূর্ণ ঠিকানায় পার্সেল রিটার্নের হার ৮০% বেশি।
          </p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4.5">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-neutral-100 text-sm">
              ৪. দ্রুত গ্রাহক যাচাই-এ রিপোর্ট করুন
            </h3>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            কোনো গ্রাহক যদি পার্সেল ফিরিয়ে দেয় বা যোগাযোগ বন্ধ করে দেয়, তৎক্ষণাৎ তার মোবাইল নম্বরটি আমাদের প্ল্যাটফর্মে রিপোর্ট করুন। এতে অন্য অনলাইন বিক্রেতারা ক্ষতির হাত থেকে রক্ষা পাবেন।
          </p>
        </div>
      </div>
    </div>
  );
};
