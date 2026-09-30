import { FraudFeedback, AggregatedCustomer, FraudCategory } from '../types';
import { normalizePhone } from './phoneUtils';

const STORAGE_KEY = 'sellerguard_fraud_reports_live_v2';

export function getStoredReports(): FraudFeedback[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed;
  } catch {
    return [];
  }
}

export function saveReport(newReport: Omit<FraudFeedback, 'id' | 'createdAt'>): FraudFeedback {
  const reports = getStoredReports();
  const normalizedPhone = normalizePhone(newReport.customerPhone);

  const createdReport: FraudFeedback = {
    ...newReport,
    id: `rep-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    customerPhone: normalizedPhone,
    createdAt: new Date().toISOString(),
  };

  const updatedReports = [createdReport, ...reports];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReports));
  } catch (e) {
    console.error('Failed to save to storage', e);
  }

  // Dispatch custom storage event for real-time tab sync
  window.dispatchEvent(new Event('sellerguard_storage_update'));

  return createdReport;
}

export function deleteStoredReport(
  reportId?: string, 
  customerPhone?: string, 
  feedbackText?: string
): void {
  try {
    const reports = getStoredReports();
    const updated = reports.filter((r) => {
      if (reportId && r.id === reportId) return false;
      if (customerPhone && feedbackText) {
        if (
          normalizePhone(r.customerPhone) === normalizePhone(customerPhone) &&
          r.feedbackText?.trim() === feedbackText?.trim()
        ) {
          return false;
        }
      } else if (customerPhone) {
        if (normalizePhone(r.customerPhone) === normalizePhone(customerPhone)) {
          return false;
        }
      }
      return true;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('sellerguard_storage_update'));
  } catch (e) {
    console.error('Failed to delete from storage', e);
  }
}

export function aggregateFeedbackArray(phoneQuery: string, matched: FraudFeedback[]): AggregatedCustomer | null {
  const normalized = normalizePhone(phoneQuery);
  if (!normalized || matched.length === 0) {
    return null;
  }

  // Deduplicate any identical reports (same phone, seller shop name, and feedback text)
  const uniqueReports: FraudFeedback[] = [];
  const seenKeys = new Set<string>();

  for (const rep of matched) {
    const cleanPhone = (rep.customerPhone || '').trim();
    const cleanShop = (rep.sellerShopName || '').trim().toLowerCase();
    const cleanText = (rep.feedbackText || '').trim().toLowerCase();
    const dedupKey = `${cleanPhone}_${cleanShop}_${cleanText}`;

    if (!seenKeys.has(dedupKey)) {
      seenKeys.add(dedupKey);
      uniqueReports.push(rep);
    }
  }

  if (uniqueReports.length === 0) {
    return null;
  }

  const namesSet = new Set<string>();
  const couriersSet = new Set<string>();
  const categoryCounts: { [key in FraudCategory]?: number } = {};
  let totalLoss = 0;

  const sorted = [...uniqueReports].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  sorted.forEach(rep => {
    if (rep.customerName?.trim()) {
      namesSet.add(rep.customerName.trim());
    }
    if (rep.courierService?.trim()) {
      couriersSet.add(rep.courierService.trim());
    }
    categoryCounts[rep.category] = (categoryCounts[rep.category] || 0) + 1;
    totalLoss += Number(rep.lossAmount) || 0;
  });

  const count = sorted.length;
  let riskLevel: 'low_risk' | 'high_risk' | 'blacklist' = 'low_risk';
  let riskLabelBangla = '';

  if (count >= 5) {
    riskLevel = 'high_risk';
    riskLabelBangla = 'উচ্চ ঝুঁকিপূর্ণ (একাধিক অভিযোগ)';
  }

  return {
    phone: normalized,
    names: Array.from(namesSet),
    totalReports: count,
    totalLossAmount: totalLoss,
    riskLevel,
    riskLabelBangla,
    categories: categoryCounts,
    couriersUsed: Array.from(couriersSet),
    feedbacks: sorted,
    lastReportedAt: sorted[0]?.createdAt || new Date().toISOString(),
  };
}

export function aggregateCustomerByPhone(phoneQuery: string): AggregatedCustomer | null {
  const normalized = normalizePhone(phoneQuery);
  if (!normalized) return null;

  const allReports = getStoredReports();
  const matched = allReports.filter(r => r.customerPhone === normalized);
  return aggregateFeedbackArray(normalized, matched);
}

export function getPlatformStats() {
  const reports = getStoredReports();
  const uniquePhones = new Set(reports.map(r => r.customerPhone)).size;
  const totalLoss = reports.reduce((acc, curr) => acc + (Number(curr.lossAmount) || 0), 0);
  const uniqueSellers = new Set(reports.map(r => r.sellerShopName)).size;

  return {
    totalReportsCount: reports.length,
    totalFraudCustomers: uniquePhones,
    totalLossSaved: totalLoss,
    totalSellers: uniqueSellers,
  };
}
