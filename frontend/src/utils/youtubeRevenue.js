const RPM = {
  long: 1.73,
  shorts: 0.15,
};

const PREMIUM_SHARE = 0.048;

export function daysSince(dateString) {
  const created = new Date(dateString);
  const now = new Date();
  return Math.max(1, Math.floor((now - created) / (1000 * 60 * 60 * 24)));
}

export function estimateRevenue({ totalViews, publishedAt, period, contentType }) {
  const days = daysSince(publishedAt);
  const baselineDailyViews = Math.round(totalViews / days / 100) * 100;

  const periodDays = period === "yearly" ? 365 : 30;
  const viewsThisPeriod = baselineDailyViews * periodDays;

  const rpm = RPM[contentType] ?? RPM.long;
  const grossRevenue = (viewsThisPeriod / 1000) * rpm;

  const premiumRevenue = grossRevenue * PREMIUM_SHARE;
  const adsRevenue = grossRevenue - premiumRevenue;

  return {
    baselineDailyViews,
    viewsThisPeriod,
    effectiveRpm: rpm,
    totalRevenue: Math.round(grossRevenue),
    adsRevenue: Math.round(adsRevenue),
    premiumRevenue: Math.round(premiumRevenue),
  };
}
