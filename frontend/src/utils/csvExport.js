import Papa from 'papaparse';

export function exportPricesToCSV(priceList, filename = 'gold_silver_rates_history.csv') {
  if (!priceList || priceList.length === 0) {
    alert('No price history available to export.');
    return;
  }

  const formattedData = priceList.map((item, idx) => {
    // Format timestamp
    const entryDate = item.date || '';
    const entryTime = item.time || (item.createdAt ? new Date(item.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : '');

    return {
      'S.No': idx + 1,
      'Date': entryDate,
      'Time': entryTime,
      'Gold 24K (₹/10g)': item.gold24k,
      'Gold 22K (₹/10g)': item.gold22k,
      'Gold 20K (₹/10g)': item.gold20k,
      'Silver (₹/10g)': item.silver,
      'Note / Session': item.note || '',
      'Created At': item.createdAt ? new Date(item.createdAt).toLocaleString() : ''
    };
  });

  const csv = Papa.unparse(formattedData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

