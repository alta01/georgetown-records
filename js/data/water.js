// ═══════════════════════════════════════════════════════
// WATER OVERSIGHT — Rate Chart
// ═══════════════════════════════════════════════════════
// ── Water rate data — sourced from gmwss.com/rates.htm and GMWSS published rate sheets ──
// Historical actuals: gmwss.com/docs/Water-Sewer-Rate-Comparisons-2022.pdf (and prior years)
// Approved schedule (2023–2028): georgetownky.gov/DocumentCenter/View/1794/2022-Rate-Study-12122022-v3
export const WATER_RATE_DATA = {
  // Full history labels (rate effective year)
  labels: ['2007','2019','Mar\n2023','Mar\n2024','Mar\n2025','Mar\n2026','Mar\n2027','Mar\n2028'],
  // labelsFull: used in tooltip
  labelsFull: ['2007 (last pre-2019 increase)','2019 (stepped structure begins)','March 2023','March 2024','March 2025','March 2026 (current)','March 2027 (projected)','March 2028 (projected)'],
  water:  [7.59,  13.49, 15.78, 18.47, 21.61, 22.90, 24.28, 25.73],  // fixed charge, first 2000 gal
  sewer:  [7.49,  12.42, 14.53, 17.00, 19.89, 21.09, 22.35, 23.69],  // fixed charge, first 2000 gal
  // isProjected[i] = true → dashed segment after this index
  isProjected: [false, false, false, false, false, false, true, true],
};
