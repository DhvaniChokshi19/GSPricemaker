import React, { useState } from 'react';
import { Download, Share2, Mail, MessageCircle, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatIndianCurrency } from '../utils/numberConverters';

export default function ShareButtons({ canvasRef, priceData }) {
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  const getPriceSummaryText = () => {
    if (!priceData) return 'Today\'s Gold & Silver Rates';
    return (
`✨ *TODAY'S GOLD & SILVER RATES* ✨
📅 Date: ${priceData.date || 'Today'} (${priceData.time || ''})
----------------------------
🪙 *Gold 24K:* ₹${formatIndianCurrency(priceData.gold24k)} / 10g
🪙 *Gold 22K:* ₹${formatIndianCurrency(priceData.gold22k)} / 10g
🪙 *Gold 20K:* ₹${formatIndianCurrency(priceData.gold20k)} / 10g
⚪ *Silver:*   ₹${formatIndianCurrency(priceData.silver)} / 10g
----------------------------
*GST & Making charges extra applicable.`
    );
  };

  // 1. Download PNG
  const handleDownload = async () => {
    if (!canvasRef.current) return;
    const blob = await canvasRef.current.getBlob();
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const filename = `rates_${priceData?.date || 'today'}_${(priceData?.time || '').replace(/[: ]/g, '_')}.png`;
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // celebrate with subtle confetti
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
  };

  // 2. Share via Web Share API (WhatsApp Status, Android/iOS Share Sheet with Image)
  const handleNativeShare = async () => {
    if (!canvasRef.current) return;
    setSharing(true);

    try {
      const blob = await canvasRef.current.getBlob();
      const filename = `rates_${priceData?.date || 'today'}.png`;
      const file = new File([blob], filename, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Today's Gold & Silver Rates",
          text: getPriceSummaryText(),
        });
      } else if (navigator.share) {
        // Fallback text share if files aren't supported on device
        await navigator.share({
          title: "Today's Gold & Silver Rates",
          text: getPriceSummaryText(),
        });
      } else {
        // Desktop fallback: prompt to download image & open WhatsApp
        handleWhatsAppWeb();
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.warn('Share error:', err);
      }
    } finally {
      setSharing(false);
    }
  };

  // 3. Share text on WhatsApp directly
  const handleWhatsAppWeb = () => {
    const text = encodeURIComponent(getPriceSummaryText());
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // 4. Share via Email
  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Today's Gold & Silver Rates - ${priceData?.date || ''}`);
    const body = encodeURIComponent(getPriceSummaryText() + '\n\n(See attached template or downloaded rates image)');
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  // 5. Copy summary to clipboard
  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(getPriceSummaryText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Clipboard copy failed', err);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-amber-100 p-5 space-y-3">
      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
        Download & Share Image
      </h3>

      {/* Primary Action: Download Ready Image */}
      <button
        onClick={handleDownload}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition active:scale-[0.99]"
      >
        <Download className="w-5 h-5" />
        Download Ready Image (PNG)
      </button>

      {/* WhatsApp Status & Share Sheet (Native) */}
      <button
        onClick={handleNativeShare}
        disabled={sharing}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 px-4 rounded-xl shadow flex items-center justify-center gap-2 transition"
      >
        <Share2 className="w-4 h-4" />
        Share to WhatsApp Status & Apps
      </button>

      {/* Secondary share options */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        <button
          onClick={handleWhatsAppWeb}
          className="flex flex-col items-center justify-center py-2 px-2 rounded-lg border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition text-xs font-semibold"
          title="Send to WhatsApp chats"
        >
          <MessageCircle className="w-4 h-4 mb-1" />
          WhatsApp
        </button>

        <button
          onClick={handleEmailShare}
          className="flex flex-col items-center justify-center py-2 px-2 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition text-xs font-semibold"
          title="Share via Email"
        >
          <Mail className="w-4 h-4 mb-1" />
          Email
        </button>

        <button
          onClick={handleCopyText}
          className="flex flex-col items-center justify-center py-2 px-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 transition text-xs font-semibold"
          title="Copy text summary"
        >
          {copied ? <Check className="w-4 h-4 mb-1 text-emerald-600" /> : <Copy className="w-4 h-4 mb-1" />}
          {copied ? 'Copied!' : 'Copy Text'}
        </button>
      </div>
    </div>
  );
}

