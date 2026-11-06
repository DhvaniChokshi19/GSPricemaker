/**
 * Precise coordinates calibrated against the 716 x 1024 template.png
 */
export const TEMPLATE_CONFIG = {
  width: 716,
  height: 1024,
  
  // Date & Time below "Gold & Silver"
  dateTime: {
    x: 358,
    y: 380,
    font: '600 20px "Segoe UI", Arial, sans-serif',
    color: '#8b4513',
    align: 'center',
  },

  // English Price Column (Left box)
  // Left ₹ is at X ~ 310. Number placed right next to ₹ at X: 350
  englishColumn: {
    align: 'left',
    color: '#000000',
    font: 'bold 28px "Segoe UI", Arial, sans-serif',
    x: 333,
  },

  // Gujarati Price Column (Right box)
  // Right ₹ is at X ~ 520. Number placed right next to ₹ at X: 558
  gujaratiColumn: {
    align: 'left',
    color: '#000000',
    font: 'bold 28px "Shruti", "Gujarati Sangam MN", "Nirmala UI", sans-serif',
    x: 545,
  },

  rows: {
    gold24k: { y: 489 },
    gold22k: { y: 585 },
    gold20k: { y: 682 },
    silver:  { y: 836 },
  }
};
