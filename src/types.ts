export type FraudCategory =
  | 'refused_delivery'       // পার্সেল রিসিভ করেনি / রিটার্ন
  | 'phone_switched_off'     // ফোন বন্ধ / রিসিভ করেনি
  | 'fake_order'             // ফেক বা ভুয়া অর্ডার
  | 'delivery_charge_fraud'  // ডেলিভারি চার্জ না দিয়ে ব্লক
  | 'harassment_abusive'     // ডেলিভারিম্যান বা পেইজের সাথে দুর্ব্যবহার
  | 'damaged_swapped_return';// পার্সেল খুলে অন্য জিনিস রিটার্ন

export interface FraudFeedback {
  id: string;
  customerPhone: string;     // Normalized 11 digits: '01XXXXXXXXX'
  customerName: string;      // গ্রাহকের নাম
  sellerShopName: string;    // শপ বা পেজের নাম
  sellerPlatform: 'facebook' | 'instagram' | 'website' | 'daraz' | 'other';
  isVerifiedSeller?: boolean;
  category: FraudCategory;
  lossAmount: number;        // আর্থিক ক্ষতি (কুরিয়ার ও রিটার্ন চার্জ - টাকা)
  courierService: string;    // Steadfast, Pathao, RedX, ইত্যাদি
  feedbackText: string;      // বিস্তারিত অভিজ্ঞতা ও অভিযোগ
  createdAt: string;         // ISO date string
  location?: string;         // এলাকা / জেলা
  orderNumber?: string;      // অর্ডার বা ট্র্যাকিং আইডি
}

export interface AggregatedCustomer {
  phone: string;
  names: string[];
  totalReports: number;
  totalLossAmount: number;
  riskLevel: 'safe' | 'low_risk' | 'high_risk' | 'blacklist';
  riskLabelBangla: string;
  categories: { [key in FraudCategory]?: number };
  couriersUsed: string[];
  feedbacks: FraudFeedback[];
  lastReportedAt: string;
}
