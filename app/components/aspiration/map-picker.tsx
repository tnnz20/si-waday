import { useState } from 'react';

import { MAP_PRESET_LOCATIONS, type MapPresetLocation } from '@/constants/tapin';

import { Compass, Crosshair, Layers, MapPin, Minus, Navigation, Plus } from 'lucide-react';

interface MapPickerProps {
  latitude: number;
  longitude: number;
  onChange: (coords: { lat: number; lng: number }) => void;
  selectedDistrict?: string;
}

export function MapPicker({ latitude, longitude, onChange, selectedDistrict }: MapPickerProps) {
  const [mapMode, setMapMode] = useState<'satellite' | 'street'>('satellite');
  const [zoomLevel, setZoomLevel] = useState<number>(14);

  // Map coordinates to percentage for interactive marker placement within viewBox
  // Tapin region roughly bounds: lat -3.20 to -2.75, lng 114.85 to 115.35
  const minLat = -3.25;
  const maxLat = -2.75;
  const minLng = 114.85;
  const maxLng = 115.35;

  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

  const latToPercent = (lat: number) => {
    const clamped = clamp(lat, minLat, maxLat);
    return ((maxLat - clamped) / (maxLat - minLat)) * 100;
  };

  const lngToPercent = (lng: number) => {
    const clamped = clamp(lng, minLng, maxLng);
    return ((clamped - minLng) / (maxLng - minLng)) * 100;
  };

  const percentToCoords = (xPercent: number, yPercent: number) => {
    const newLng = minLng + (xPercent / 100) * (maxLng - minLng);
    const newLat = maxLat - (yPercent / 100) * (maxLat - minLat);
    return {
      lat: Number(newLat.toFixed(6)),
      lng: Number(newLng.toFixed(6)),
    };
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPercent = clamp((x / rect.width) * 100, 5, 95);
    const yPercent = clamp((y / rect.height) * 100, 5, 95);
    const newCoords = percentToCoords(xPercent, yPercent);
    onChange(newCoords);
  };

  const handleSelectPreset = (preset: MapPresetLocation) => {
    onChange({ lat: preset.lat, lng: preset.lng });
  };

  const handleCurrentGps = () => {
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          onChange({
            lat: Number(pos.coords.latitude.toFixed(6)),
            lng: Number(pos.coords.longitude.toFixed(6)),
          });
        },
        () => {
          // Fallback to Rantau city center if permission denied or error
          onChange({ lat: -2.9381, lng: 115.1524 });
        }
      );
    } else {
      onChange({ lat: -2.9381, lng: 115.1524 });
    }
  };

  const markerX = lngToPercent(longitude);
  const markerY = latToPercent(latitude);

  return (
    <div className="border-warm-300 overflow-hidden rounded-2xl border bg-white shadow-sm">
      {/* Top Map Control Toolbar */}
      <div className="border-warm-200 bg-warm-50 flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2 text-xs">
        <div className="text-darknavy-900 flex items-center gap-1.5 font-bold">
          <MapPin className="text-accent-500 h-3.5 w-3.5" aria-hidden="true" />
          <span>Wilayah Kabupaten Tapin (Kalsel)</span>
          {selectedDistrict ? (
            <span className="border-warm-300 bg-warm-200 text-darknavy-900 text-2xs rounded-full border px-2 py-0.5 font-semibold">
              Kec. {selectedDistrict}
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-1">
          {/* Mode Switcher */}
          <div className="border-warm-300 flex rounded-lg border bg-white p-0.5 shadow-xs">
            <button
              type="button"
              onClick={() => setMapMode('satellite')}
              className={`text-2xs flex items-center gap-1 rounded-md px-2 py-1 font-bold transition-colors ${
                mapMode === 'satellite'
                  ? 'bg-darknavy-900 text-white'
                  : 'hover:text-darknavy-900 text-slate-600'
              }`}
            >
              <Layers className="h-3 w-3" aria-hidden="true" />
              <span>Satelit</span>
            </button>
            <button
              type="button"
              onClick={() => setMapMode('street')}
              className={`text-2xs flex items-center gap-1 rounded-md px-2 py-1 font-bold transition-colors ${
                mapMode === 'street'
                  ? 'bg-darknavy-900 text-white'
                  : 'hover:text-darknavy-900 text-slate-600'
              }`}
            >
              <Navigation className="h-3 w-3" aria-hidden="true" />
              <span>Peta Jalan</span>
            </button>
          </div>

          {/* GPS Quick Action */}
          <button
            type="button"
            onClick={handleCurrentGps}
            title="Gunakan Titik GPS Terdekat"
            className="border-warm-300 text-darknavy-900 hover:bg-warm-100 text-2xs flex items-center gap-1 rounded-lg border bg-white px-2 py-1 font-semibold shadow-xs"
          >
            <Crosshair className="text-accent-500 h-3 w-3" aria-hidden="true" />
            <span className="hidden sm:inline">Titik GPS</span>
          </button>
        </div>
      </div>

      {/* Preset Regional Location Pills */}
      <div className="border-warm-200 text-2xs flex items-center gap-1.5 overflow-x-auto border-b bg-white px-3 py-1.5">
        <span className="shrink-0 font-medium text-slate-400">Titik Fokus:</span>
        {MAP_PRESET_LOCATIONS.map((preset) => {
          const isSelected =
            Math.abs(preset.lat - latitude) < 0.03 && Math.abs(preset.lng - longitude) < 0.03;
          return (
            <button
              key={preset.name}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className={`shrink-0 rounded-full border px-2.5 py-0.5 font-medium transition-all ${
                isSelected
                  ? 'border-accent-500 bg-accent-50 text-accent-600 font-bold shadow-xs'
                  : 'border-warm-200 bg-warm-50 hover:border-warm-300 hover:text-darknavy-900 text-slate-600'
              }`}
            >
              {preset.name}
            </button>
          );
        })}
      </div>

      {/* Interactive Map Visual Area */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Peta interaktif penentuan titik koordinat usulan. Klik untuk memindahkan pin lokasi."
        onClick={handleMapClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleCurrentGps();
          }
        }}
        className={`relative h-64 w-full cursor-crosshair overflow-hidden select-none sm:h-72 ${
          mapMode === 'satellite' ? 'bg-darknavy-950' : 'bg-warm-100'
        }`}
      >
        {/* Background Visual Map Texture / SVG Canvas */}
        {mapMode === 'satellite' ? (
          <div className="via-darknavy-900 to-darknavy-950 absolute inset-0 bg-radial from-slate-800">
            {/* Satellite Grid & River waterways simulation */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full opacity-45"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <defs>
                <pattern id="sat-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path
                    d="M 30 0 L 0 0 0 30"
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#sat-grid)" />
              {/* Sungai Tapin / Margasari River Curves */}
              <path
                d="M 20,40 Q 120,80 200,60 T 360,110 T 520,70 T 700,140"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="4"
                strokeOpacity="0.4"
              />
              <path
                d="M 80,180 Q 220,140 380,200 T 640,170"
                fill="none"
                stroke="#0284c7"
                strokeWidth="6"
                strokeOpacity="0.35"
              />
              {/* Arterial Roads (Trans Kalimantan / Jl. Jend Sudirman) */}
              <path
                d="M 0,220 L 700,50"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="2.5"
                strokeOpacity="0.5"
                strokeDasharray="6 3"
              />
              <path
                d="M 150,0 L 450,300"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.8"
                strokeOpacity="0.3"
              />
              {/* City Clusters */}
              <circle cx="280" cy="120" r="36" fill="#f97316" fillOpacity="0.12" />
              <circle cx="480" cy="200" r="28" fill="#10b981" fillOpacity="0.12" />
              <circle cx="140" cy="190" r="32" fill="#3b82f6" fillOpacity="0.12" />
            </svg>
          </div>
        ) : (
          <div className="bg-warm-100 absolute inset-0">
            {/* Street Map Layout simulation */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full opacity-65"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <defs>
                <pattern id="street-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="rgba(40,30,20,0.08)"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#street-grid)" />
              {/* River vector */}
              <path
                d="M 20,40 Q 120,80 200,60 T 360,110 T 520,70 T 700,140"
                fill="none"
                stroke="#60a5fa"
                strokeWidth="7"
                strokeOpacity="0.6"
              />
              {/* Primary roads */}
              <path d="M 0,220 L 700,50" fill="none" stroke="#f59e0b" strokeWidth="4" />
              <path
                d="M 150,0 L 450,300"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="3"
                strokeDasharray="4 2"
              />
              <path d="M 320,60 L 320,240" fill="none" stroke="#cbd5e1" strokeWidth="2.5" />
            </svg>
          </div>
        )}

        {/* Ambient Map Landmark Labels */}
        <div className="pointer-events-none absolute top-3 left-4">
          <div className="bg-darknavy-900/80 flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-white backdrop-blur-xs">
            <Compass className="text-accent-500 h-3 w-3 animate-spin" aria-hidden="true" />
            <span className="text-2xs font-bold tracking-wider uppercase">
              Rantau • Tapin Tengah • Binuang
            </span>
          </div>
        </div>

        {/* Dynamic Interactive Pin Marker */}
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full transition-all duration-200"
          style={{
            left: `${markerX}%`,
            top: `${markerY}%`,
          }}
        >
          {/* Pulsing ring anchor */}
          <div className="relative flex flex-col items-center">
            {/* Tooltip speech bubble */}
            <div className="border-accent-500 bg-darknavy-900 mb-1.5 flex items-center gap-1.5 rounded-lg border px-2.5 py-1 whitespace-nowrap text-white shadow-xl">
              <span className="bg-accent-500 h-2 w-2 animate-ping rounded-full" />
              <span className="text-2xs font-bold">Titik Lokasi Usulan Terpilih</span>
            </div>

            {/* Coral Pin Icon */}
            <div className="relative flex items-center justify-center">
              <div className="bg-accent-500 ring-accent-100 flex h-9 w-9 items-center justify-center rounded-full text-white shadow-2xl ring-4">
                <MapPin className="stroke-accent-600 h-5 w-5 fill-white" aria-hidden="true" />
              </div>
            </div>

            {/* Target ground indicator shadow */}
            <div className="bg-accent-500/40 mt-0.5 h-2 w-5 rounded-full blur-xs" />
          </div>
        </div>

        {/* Floating Controls: Zoom and Hint */}
        <div className="absolute right-3 bottom-3 flex flex-col items-end gap-2">
          {/* Zoom Buttons */}
          <div className="border-warm-300 flex flex-col rounded-lg border bg-white/95 shadow-md backdrop-blur-xs">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setZoomLevel((prev) => Math.min(prev + 1, 18));
              }}
              title="Perbesar Peta"
              className="text-darknavy-900 hover:bg-warm-100 flex h-7 w-7 items-center justify-center rounded-t-lg transition-colors"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <div className="border-warm-200 border-t" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setZoomLevel((prev) => Math.max(prev - 1, 10));
              }}
              title="Perkecil Peta"
              className="text-darknavy-900 hover:bg-warm-100 flex h-7 w-7 items-center justify-center rounded-b-lg transition-colors"
            >
              <Minus className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Floating Click Instruction */}
        <div className="pointer-events-none absolute bottom-3 left-3">
          <div className="bg-darknavy-900/85 text-warm-100 text-2xs flex items-center gap-1.5 rounded-md px-2 py-1 backdrop-blur-xs">
            <Crosshair className="text-accent-500 h-3 w-3" aria-hidden="true" />
            <span>Klik di area peta untuk menggeser tanda lokasi usulan</span>
          </div>
        </div>
      </div>

      {/* Coordinate & Status Footer Bar */}
      <div className="border-warm-200 bg-warm-50 flex flex-wrap items-center justify-between gap-2 border-t px-4 py-2.5 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-2xs font-semibold text-slate-500 uppercase">
            Koordinat Presisi:
          </span>
          <span className="text-darknavy-900 text-xs-tight font-mono font-bold">
            {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </span>
          <span className="text-2xs rounded-full bg-emerald-100 px-2 py-0.5 font-bold text-emerald-800">
            Zoom {zoomLevel}x
          </span>
        </div>

        <div className="text-2xs flex items-center gap-1.5 text-slate-500">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>Status: Terkunci pada peta usulan Tapin</span>
        </div>
      </div>
    </div>
  );
}
