/**
 * Maps English digits 0-9 to Gujarati digits ૦-૯
 * e.g., 78500 => "૭૮,૫૦૦"
 */
export function toGujaratiNumerals(num) {
  if (num === undefined || num === null || num === '') return '';
  const numStr = formatIndianCurrency(num);
  const gujaratiDigits = {
    '0': '૦',
    '1': '૧',
    '2': '૨',
    '3': '૩',
    '4': '૪',
    '5': '૫',
    '6': '૬',
    '7': '૭',
    '8': '૮',
    '9': '૯',
    ',': ',',
    '.': '.',
    ' ': ' '
  };
  return numStr.toString().split('').map(char => gujaratiDigits[char] || char).join('');
}

/**
 * Format number into Indian numbering format (e.g. 78,500 or 1,78,500)
 */
export function formatIndianCurrency(num) {
  if (num === undefined || num === null || num === '') return '';
  const parsed = Number(num);
  if (isNaN(parsed)) return String(num);
  return parsed.toLocaleString('en-IN');
}

