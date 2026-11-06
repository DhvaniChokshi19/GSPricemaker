import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { TEMPLATE_CONFIG } from '../config/templateCoords';
import { toGujaratiNumerals, formatIndianCurrency } from '../utils/numberConverters';

const ImageCanvas = forwardRef(({ priceData }, ref) => {
  const canvasRef = useRef(null);
  const [templateLoaded, setTemplateLoaded] = useState(false);
  const templateImgRef = useRef(null);

  // Expose methods to parent (e.g. getBlob, getDataURL)
  useImperativeHandle(ref, () => ({
    getBlob: () => {
      return new Promise((resolve) => {
        if (!canvasRef.current) return resolve(null);
        canvasRef.current.toBlob((blob) => resolve(blob), 'image/png');
      });
    },
    getDataUrl: () => {
      if (!canvasRef.current) return null;
      return canvasRef.current.toDataURL('image/png');
    }
  }));

  // Load template image on initial render
  useEffect(() => {
    const img = new Image();
    img.src = '/template.png';
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      templateImgRef.current = img;
      setTemplateLoaded(true);
      drawCanvas();
    };
    img.onerror = () => {
      console.error('Failed to load /template.png');
    };
  }, []);

  // Redraw when price data updates or image finishes loading
  useEffect(() => {
    if (templateLoaded) {
      drawCanvas();
    }
  }, [priceData, templateLoaded]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !templateImgRef.current) return;
    const ctx = canvas.getContext('2d');

    const { width, height } = TEMPLATE_CONFIG;
    canvas.width = width;
    canvas.height = height;

    // 1. Draw base Canva template
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(templateImgRef.current, 0, 0, width, height);

    if (!priceData) return;

    // 2. Format Date and Time
    // Date format: DD-MM-YYYY
    let displayDate = priceData.date || '';
    if (displayDate.includes('-')) {
      const parts = displayDate.split('-');
      if (parts.length === 3 && parts[0].length === 4) {
        // YYYY-MM-DD -> DD/MM/YYYY
        displayDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    }
    const displayTime = priceData.time || '';
    const dateTimeStr = `Date: ${displayDate}   |   Time: ${displayTime}`;

    // 3. Draw Date & Time
    ctx.save();
    ctx.font = TEMPLATE_CONFIG.dateTime.font;
    ctx.fillStyle = TEMPLATE_CONFIG.dateTime.color;
    ctx.textAlign = TEMPLATE_CONFIG.dateTime.align;
    ctx.textBaseline = 'middle';
    ctx.fillText(dateTimeStr, TEMPLATE_CONFIG.dateTime.x, TEMPLATE_CONFIG.dateTime.y);
    ctx.restore();

    // 4. Draw Rows (Gold 24K, 22K, 20K, Silver)
    const items = [
      { key: 'gold24k', val: priceData.gold24k, y: TEMPLATE_CONFIG.rows.gold24k.y },
      { key: 'gold22k', val: priceData.gold22k, y: TEMPLATE_CONFIG.rows.gold22k.y },
      { key: 'gold20k', val: priceData.gold20k, y: TEMPLATE_CONFIG.rows.gold20k.y },
      { key: 'silver',  val: priceData.silver,  y: TEMPLATE_CONFIG.rows.silver.y },
    ];

    items.forEach((item) => {
      if (item.val === undefined || item.val === null || item.val === '') return;

      const englishFormatted = formatIndianCurrency(item.val);
      const gujaratiFormatted = toGujaratiNumerals(item.val);

      // Left Column (English Rate)
      ctx.save();
      ctx.font = TEMPLATE_CONFIG.englishColumn.font;
      ctx.fillStyle = TEMPLATE_CONFIG.englishColumn.color;
      ctx.textAlign = TEMPLATE_CONFIG.englishColumn.align;
      ctx.textBaseline = 'middle';
      ctx.fillText(englishFormatted, TEMPLATE_CONFIG.englishColumn.x, item.y);
      ctx.restore();

      // Right Column (Gujarati Rate)
      ctx.save();
      ctx.font = TEMPLATE_CONFIG.gujaratiColumn.font;
      ctx.fillStyle = TEMPLATE_CONFIG.gujaratiColumn.color;
      ctx.textAlign = TEMPLATE_CONFIG.gujaratiColumn.align;
      ctx.textBaseline = 'middle';
      ctx.fillText(gujaratiFormatted, TEMPLATE_CONFIG.gujaratiColumn.x, item.y);
      ctx.restore();
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-200/80 bg-white max-w-full">
        <canvas
          ref={canvasRef}
          className="w-full h-auto max-h-[640px] object-contain block mx-auto"
          style={{ aspectRatio: `${TEMPLATE_CONFIG.width} / ${TEMPLATE_CONFIG.height}` }}
        />
        {!templateLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100/90">
            <span className="text-sm font-semibold text-gray-500 animate-pulse">
              Loading Canva Template...
            </span>
          </div>
        )}
      </div>
      <p className="text-[11px] text-gray-400 mt-2 text-center">
        716 × 1024 High-Resolution Preview • Ready for WhatsApp Status & Print
      </p>
    </div>
  );
});

export default ImageCanvas;

