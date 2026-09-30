/**
 * Normalizes Bangladeshi phone numbers
 * Handles:
 * - Bangla numerals: ০১৭১২-৩৪৫৬৭৮ -> 01712345678
 * - Country code: +88017..., 88017... -> 017...
 * - Separators: dashes, spaces, brackets
 */
export function normalizePhone(rawInput: string): string {
  if (!rawInput) return '';

  // 1. Convert Bangla numerals to English numerals
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  let cleaned = rawInput.trim();
  
  for (let i = 0; i < banglaDigits.length; i++) {
    cleaned = cleaned.replaceAll(banglaDigits[i], i.toString());
  }

  // 2. Strip non-digits except +
  cleaned = cleaned.replace(/[^\d+]/g, '');

  // 3. Remove leading +88 or 88
  if (cleaned.startsWith('+88')) {
    cleaned = cleaned.slice(3);
  } else if (cleaned.startsWith('88') && cleaned.length >= 13) {
    cleaned = cleaned.slice(2);
  }

  // 4. Ensure it has 11 digits starting with 01
  return cleaned;
}

export function isValidBdPhone(phone: string): boolean {
  const normalized = normalizePhone(phone);
  // Valid BD mobile operators: 013, 014, 015, 016, 017, 018, 019
  const bdMobileRegex = /^01[3-9]\d{8}$/;
  return bdMobileRegex.test(normalized);
}

export function formatPhoneDisplay(phone: string): string {
  const norm = normalizePhone(phone);
  if (norm.length === 11) {
    return `${norm.slice(0, 5)}-${norm.slice(5)}`;
  }
  return phone;
}

export function getCategoryLabel(category: string): string {
  switch (category) {
    case 'refused_delivery':
      return 'পার্সেল রিসিভ করেনি / রিটার্ন';
    case 'phone_switched_off':
      return 'ফোন বন্ধ / রিসিভ করেনি';
    case 'fake_order':
      return 'ফেক বা ভুয়া অর্ডার';
    case 'delivery_charge_fraud':
      return 'ডেলিভারি চার্জ না দিয়ে ব্লক';
    case 'harassment_abusive':
      return 'খারাপ ব্যবহার / অসদাচরণ';
    case 'damaged_swapped_return':
      return 'প্যাকেট খুলে বদলে রিটার্ন';
    default:
      return 'প্রতারণামূলক আচরণ';
  }
}
