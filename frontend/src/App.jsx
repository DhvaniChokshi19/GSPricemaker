import React, { useState, useEffect, useRef } from 'react';
import PriceForm from './components/PriceForm';
import ImageCanvas from './components/ImageCanvas';
import ShareButtons from './components/ShareButtons';
import PriceHistory from './components/PriceHistory';
import { Gem, Sparkles } from 'lucide-react';

export default function App() {
  const [currentPrice, setCurrentPrice] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
    gold24k: 78500,
    gold22k: 72000,
    gold20k: 65400,
    silver: 920,
    note: 'Sample Rates'
  });
  const [history, setHistory] = useState([]);
  const canvasRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Load latest price and history from API on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_URL}/prices`);
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        setHistory(data.data);
        setCurrentPrice(data.data[0]); // most recent entry
      }
    } catch (err) {
      console.log('Backend not currently reachable, continuing with default local state.');
    }
  };

  const handlePriceSaved = (newRecord) => {
    setCurrentPrice(newRecord);
    setHistory((prev) => [newRecord, ...prev.filter(item => item._id !== newRecord._id)]);
  };

  const handleDeleteRecord = async (id) => {
    if (!window.confirm('Are you sure you want to delete this price record?')) return;
    try {
      await fetch(`${API_URL}/prices/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('API delete error, deleting locally', e);
    }
    setHistory((prev) => prev.filter(item => item._id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
  

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

          {/* Left Column: Form & Actions (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <PriceForm
              onPriceSaved={handlePriceSaved}
              initialValues={currentPrice}
            />

            <ShareButtons
              canvasRef={canvasRef}
              priceData={currentPrice}
            />
          </div>

          {/* Right Column: Live Canva Image Preview (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full bg-white rounded-2xl shadow-md border border-amber-100 p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4 pb-2 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                  Live Ready Template
                </h2>
                <span className="text-xs text-gray-500">
                  Left: English • Right: ગુજરાતી
                </span>
              </div>

              <ImageCanvas
                ref={canvasRef}
                priceData={currentPrice}
              />
            </div>
          </div>

        </div>

        {/* Bottom Section: Full History & CSV Export */}
        <div className="mt-10">
          <PriceHistory
            history={history}
            onDelete={handleDeleteRecord}
            onSelectForPreview={(item) => setCurrentPrice(item)}
          />
        </div>
      </main>
    </div>
  );
}
