import React, { useState } from 'react';
import { Download, Trash2, Calendar, Clock, Search } from 'lucide-react';
import { exportPricesToCSV } from '../utils/csvExport';
import { formatIndianCurrency } from '../utils/numberConverters';

export default function PriceHistory({ history, onDelete, onSelectForPreview }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = history.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      (item.date && item.date.toLowerCase().includes(term)) ||
      (item.time && item.time.toLowerCase().includes(term)) ||
      (item.note && item.note.toLowerCase().includes(term))
    );
  });

  return (
    <div className="bg-white rounded-2xl shadow-md border border-amber-100 p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Rate Entry History</h2>
          <p className="text-xs text-gray-500">
            Total {history.length} records • Full audit trail saved (per 10g)
          </p>
        </div>

        {/* CSV Export Button */}
        <button
          onClick={() => exportPricesToCSV(history)}
          disabled={history.length === 0}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white font-bold py-2 px-4 rounded-xl shadow transition text-sm self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          Export to CSV
        </button>
      </div>

      {/* Search Filter */}
      {history.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by date (YYYY-MM-DD), session, or time..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      )}

      {/* History Table */}
      {filteredHistory.length === 0 ? (
        <div className="text-center py-10 text-gray-400 text-sm">
          {history.length === 0 ? 'No rate entries yet. Enter prices above to see history.' : 'No matching entries found.'}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600 border-collapse">
            <thead>
              <tr className="bg-amber-50/70 text-amber-900 border-b border-amber-200 font-semibold uppercase">
                <th className="py-2.5 px-3">Date & Time</th>
                <th className="py-2.5 px-3">Session</th>
                <th className="py-2.5 px-3">Gold 24K</th>
                <th className="py-2.5 px-3">Gold 22K</th>
                <th className="py-2.5 px-3">Gold 20K</th>
                <th className="py-2.5 px-3">Silver</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredHistory.map((item) => (
                <tr key={item._id || item.createdAt} className="hover:bg-amber-50/30 transition">
                  <td className="py-2.5 px-3 font-medium text-gray-900">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-600" />
                      <span>{item.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{item.time || ''}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[11px] font-medium">
                      {item.note || 'Regular'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-amber-900">
                    ₹{formatIndianCurrency(item.gold24k)}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-amber-900">
                    ₹{formatIndianCurrency(item.gold22k)}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-amber-900">
                    ₹{formatIndianCurrency(item.gold20k)}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-700">
                    ₹{formatIndianCurrency(item.silver)}
                  </td>
                  <td className="py-2.5 px-3 text-right space-x-2">
                    <button
                      onClick={() => onSelectForPreview(item)}
                      className="text-amber-700 hover:text-amber-900 font-semibold hover:underline"
                      title="Load into image preview"
                    >
                      Preview
                    </button>
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item._id)}
                        className="text-red-400 hover:text-red-600 p-1 rounded transition"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5 inline" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

