import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Clock, Calendar } from 'lucide-react';

export default function PriceForm({ onPriceSaved, initialValues }) {
  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(todayStr);
  const [time, setTime] = useState('');
  const [gold24k, setGold24k] = useState('');
  const [gold22k, setGold22k] = useState('');
  const [gold20k, setGold20k] = useState('');
  const [silver, setSilver] = useState('');
  const [note, setNote] = useState('Morning');
  const [loading, setLoading] = useState(false);

  // Set current time on load
  useEffect(() => {
    updateToCurrentTime();
  }, []);

  useEffect(() => {
    if (initialValues) {
      if (initialValues.gold24k) setGold24k(initialValues.gold24k);
      if (initialValues.gold22k) setGold22k(initialValues.gold22k);
      if (initialValues.gold20k) setGold20k(initialValues.gold20k);
      if (initialValues.silver) setSilver(initialValues.silver);
    }
  }, [initialValues]);

  const updateToCurrentTime = () => {
    const now = new Date();
    const formatted = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    setTime(formatted);

    // auto set session note
    const hr = now.getHours();
    if (hr < 13) setNote('Morning Rate');
    else if (hr < 17) setNote('Afternoon Rate');
    else setNote('Evening Rate');
  };

  // Helper: Calculate 22K and 20K automatically from 24K if user wants
  const handleAutoCalculate = (val24) => {
    setGold24k(val24);
    const num = parseFloat(val24);
    if (!isNaN(num) && num > 0) {
      // 22K standard pure ratio: (22/24) ~ 91.66%
      setGold22k(Math.round((num * 22) / 24));
      // 20K standard pure ratio: (20/24) ~ 83.33%
      setGold20k(Math.round((num * 20) / 24));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!gold24k || !gold22k || !gold20k || !silver) {
      alert('Please fill in all 4 metal prices.');
      return;
    }

    setLoading(true);
    const payload = {
      date,
      time,
      gold24k: Number(gold24k),
      gold22k: Number(gold22k),
      gold20k: Number(gold20k),
      silver: Number(silver),
      note
    };

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/prices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (result.success) {
        onPriceSaved(result.data);
      } else {
        alert('Error saving price: ' + result.error);
      }
    } catch (err) {
      console.warn('API save fallback triggered (local state)', err);
      // Fallback local save so app functions smoothly even before DB is connected
      const fallbackData = {
        ...payload,
        _id: 'local_' + Date.now(),
        createdAt: new Date()
      };
      onPriceSaved(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-amber-100 p-4 sm:p-6">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Enter Today's Rates</h2>
          <p className="text-xs text-gray-500">Prices are per 10 Grams (₹)</p>
        </div>
        <button
          type="button"
          onClick={updateToCurrentTime}
          className="flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition"
          title="Refresh to current time"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Update Time
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date and Time Pickers */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              Time
            </label>
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g. 11:30 AM"
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Note / Session Tag (e.g. Morning, Evening) */}
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1 block">Session / Label</label>
          <div className="flex gap-2">
            {['Morning Rate', 'Afternoon Rate', 'Evening Rate'].map((label) => (
              <button
                type="button"
                key={label}
                onClick={() => setNote(label)}
                className={`text-xs px-2.5 py-1 rounded-md border font-medium transition ${
                  note === label
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {label.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Price Inputs */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {/* Gold 24K */}
          <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-200/60">
            <label className="block text-xs font-bold text-amber-900 mb-1">
              Gold 24K (₹/10g)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-sm text-gray-400 font-bold">₹</span>
              <input
                type="number"
                placeholder="e.g. 78500"
                value={gold24k}
                onChange={(e) => handleAutoCalculate(e.target.value)}
                className="w-full pl-7 pr-3 py-1.5 text-sm font-semibold text-gray-900 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                required
              />
            </div>
            <span className="text-[10px] text-amber-700/80 mt-1 block">Auto-suggests 22K & 20K</span>
          </div>

          {/* Gold 22K */}
          <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-200/60">
            <label className="block text-xs font-bold text-amber-900 mb-1">
              Gold 22K (₹/10g)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-sm text-gray-400 font-bold">₹</span>
              <input
                type="number"
                placeholder="e.g. 72000"
                value={gold22k}
                onChange={(e) => setGold22k(e.target.value)}
                className="w-full pl-7 pr-3 py-1.5 text-sm font-semibold text-gray-900 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                required
              />
            </div>
          </div>

          {/* Gold 20K */}
          <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-200/60">
            <label className="block text-xs font-bold text-amber-900 mb-1">
              Gold 20K (₹/10g)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-sm text-gray-400 font-bold">₹</span>
              <input
                type="number"
                placeholder="e.g. 65400"
                value={gold20k}
                onChange={(e) => setGold20k(e.target.value)}
                className="w-full pl-7 pr-3 py-1.5 text-sm font-semibold text-gray-900 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                required
              />
            </div>
          </div>

          {/* Silver */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Silver (₹/10g)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-sm text-gray-400 font-bold">₹</span>
              <input
                type="number"
                placeholder="e.g. 920"
                value={silver}
                onChange={(e) => setSilver(e.target.value)}
                className="w-full pl-7 pr-3 py-1.5 text-sm font-semibold text-gray-900 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:outline-none bg-white"
                required
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition duration-200"
        >
          <Save className="w-5 h-5" />
          {loading ? 'Saving...' : 'Generate Template & Save Entry'}
        </button>
      </form>
    </div>
  );
}

