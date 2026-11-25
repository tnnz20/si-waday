import { useEffect, useRef, useState } from 'react';

import type L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { toast } from 'sonner';

import { getDistrictCenter, isWithinTapinBounds, roundCoord } from '@/lib/map-utils';

import { MAP_PRESET_LOCATIONS, type MapPresetLocation, TAPIN_CENTER } from '@/constants/tapin';

import {
  AlertTriangle,
  Compass,
  Crosshair,
  Layers,
  LoaderCircle,
  MapPin,
  Minus,
  Navigation,
  Plus,
} from 'lucide-react';

interface MapPickerProps {
  latitude: number;
  longitude: number;
  onChange: (coords: { lat: number; lng: number }) => void;
  selectedDistrict?: string;
}

const TILE_CONFIG = {
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics',
  },
  street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
  },
} as const;

const CORAL_PIN_HTML = `
  <div class="relative flex flex-col items-center">
    <div class="bg-accent-500 ring-accent-100 flex h-9 w-9 items-center justify-center rounded-full text-white shadow-xl ring-4">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-accent-600"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3" fill="currentColor"/></svg>
    </div>
    <div class="bg-accent-500/40 mt-0.5 h-1.5 w-4 rounded-full"></div>
  </div>
`;

export function MapPicker({ latitude, longitude, onChange, selectedDistrict }: MapPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const leafletRef = useRef<typeof L | null>(null);
  const initialCenterRef = useRef({ lat: latitude, lng: longitude });
  const onChangeRef = useRef(onChange);

  const [mapMode, setMapMode] = useState<'satellite' | 'street'>('satellite');
  const [zoomLevel, setZoomLevel] = useState<number>(15);
  const [isMapReady, setIsMapReady] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [hasTileError, setHasTileError] = useState<boolean>(false);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // 1. Initialize Leaflet strictly on client (SSR & React 19 StrictMode safe)
  useEffect(() => {
    let cancelled = false;

    async function initMap() {
      const container = mapContainerRef.current;
      if (!container) return;

      const leafletModule = await import('leaflet');
      const Leaflet = leafletModule.default;

      if (cancelled || !mapContainerRef.current || mapRef.current) return;

      leafletRef.current = Leaflet;

      const { lat: startLat, lng: startLng } = initialCenterRef.current;

      const map = Leaflet.map(mapContainerRef.current, {
        center: [startLat, startLng],
        zoom: 15,
        minZoom: 10,
        maxZoom: 19,
        zoomControl: false,
      });

      const initialTile = Leaflet.tileLayer(TILE_CONFIG.satellite.url, {
        attribution: TILE_CONFIG.satellite.attribution,
        maxZoom: 19,
      });
      initialTile.on('tileerror', () => setHasTileError(true));
      initialTile.on('load', () => setHasTileError(false));
      initialTile.addTo(map);
      tileLayerRef.current = initialTile;

      const customIcon = Leaflet.divIcon({
        html: CORAL_PIN_HTML,
        className: '',
        iconSize: [36, 42],
        iconAnchor: [18, 36],
      });

      const marker = Leaflet.marker([startLat, startLng], {
        icon: customIcon,
        draggable: true,
      }).addTo(map);

      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        onChangeRef.current({ lat: roundCoord(pos.lat), lng: roundCoord(pos.lng) });
      });

      map.on('click', (e: L.LeafletMouseEvent) => {
        const nextCoords = { lat: roundCoord(e.latlng.lat), lng: roundCoord(e.latlng.lng) };
        marker.setLatLng([nextCoords.lat, nextCoords.lng]);
        onChangeRef.current(nextCoords);
      });

      map.on('zoomend', () => {
        setZoomLevel(map.getZoom());
      });

      mapRef.current = map;
      markerRef.current = marker;
      setZoomLevel(map.getZoom());
      setIsMapReady(true);
    }

    void initMap();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markerRef.current = null;
      tileLayerRef.current = null;
      setIsMapReady(false);
    };
  }, []);

  // 2. Swap tile layer cleanly when Satelit / Peta Jalan mode changes
  useEffect(() => {
    const map = mapRef.current;
    const Leaflet = leafletRef.current;
    if (!map || !Leaflet || !isMapReady) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const config = TILE_CONFIG[mapMode];
    const nextTile = Leaflet.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: 19,
    });
    nextTile.on('tileerror', () => setHasTileError(true));
    nextTile.on('load', () => setHasTileError(false));
    nextTile.addTo(map);
    tileLayerRef.current = nextTile;
  }, [mapMode, isMapReady]);

  // 3. Keep marker position in sync when latitude/longitude props change
  useEffect(() => {
    if (markerRef.current && isMapReady) {
      markerRef.current.setLatLng([latitude, longitude]);
    }
  }, [latitude, longitude, isMapReady]);

  const focusCoords = (lat: number, lng: number, targetZoom = 15) => {
    const roundedLat = roundCoord(lat);
    const roundedLng = roundCoord(lng);
    onChange({ lat: roundedLat, lng: roundedLng });
    mapRef.current?.flyTo([roundedLat, roundedLng], targetZoom, { duration: 0.6 });
  };

  const handleSelectPreset = (preset: MapPresetLocation) => {
    focusCoords(preset.lat, preset.lng, 15);
  };

  const handleSelectDistrict = () => {
    if (!selectedDistrict) return;
    const center = getDistrictCenter(selectedDistrict);
    focusCoords(center.lat, center.lng, 14);
    toast.info(`Peta difokuskan ke Kecamatan ${selectedDistrict}`);
  };

  const handleCurrentGps = () => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      toast.error('Perangkat Anda tidak mendukung fitur GPS browser.');
      focusCoords(TAPIN_CENTER.lat, TAPIN_CENTER.lng, 15);
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const gpsLat = roundCoord(pos.coords.latitude);
        const gpsLng = roundCoord(pos.coords.longitude);
        focusCoords(gpsLat, gpsLng, 16);

        if (!isWithinTapinBounds(gpsLat, gpsLng)) {
          toast.warning('Lokasi GPS berada di luar Kabupaten Tapin', {
            description: 'Silakan geser pin ke lokasi usulan di wilayah Kabupaten Tapin.',
          });
        } else {
          toast.success('Titik GPS ditemukan', {
            description: 'Geser pin pada peta jika perlu penyesuaian presisi.',
          });
        }
      },
      () => {
        setIsLocating(false);
        toast.error('Izin lokasi GPS ditolak atau gagal diakses', {
          description: 'Silakan klik langsung di peta atau pilih Titik Fokus terdekat.',
        });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const isWithinTapin = isWithinTapinBounds(latitude, longitude);

  return (
    <div className="border-warm-300 overflow-hidden rounded-2xl border bg-white shadow-sm">
      {/* Top Map Control Toolbar */}
      <div className="border-warm-200 bg-warm-50 flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2 text-xs">
        <div className="text-darknavy-900 flex items-center gap-1.5 font-bold">
          <MapPin className="text-accent-500 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>Wilayah Kabupaten Tapin (Kalsel)</span>
          {selectedDistrict ? (
            <button
              type="button"
              onClick={handleSelectDistrict}
              title={`Pusatkan peta ke Kecamatan ${selectedDistrict}`}
              className="border-warm-300 bg-warm-200 hover:border-accent-400 hover:bg-accent-50 text-darknavy-900 text-2xs inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-semibold transition-colors"
            >
              <span>Kec. {selectedDistrict}</span>
            </button>
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
            disabled={isLocating}
            title="Gunakan Titik GPS Terdekat"
            className="border-warm-300 text-darknavy-900 hover:bg-warm-100 text-2xs flex items-center gap-1 rounded-lg border bg-white px-2 py-1 font-semibold shadow-xs disabled:opacity-60"
          >
            {isLocating ? (
              <LoaderCircle className="text-accent-500 h-3 w-3 animate-spin" aria-hidden="true" />
            ) : (
              <Crosshair className="text-accent-500 h-3 w-3" aria-hidden="true" />
            )}
            <span className="hidden sm:inline">{isLocating ? 'Mencari...' : 'Titik GPS'}</span>
          </button>
        </div>
      </div>

      {/* Preset Regional Location Pills */}
      <div className="border-warm-200 text-2xs flex items-center gap-1.5 overflow-x-auto border-b bg-white px-3 py-1.5">
        <span className="shrink-0 font-medium text-slate-400">Titik Fokus:</span>
        {MAP_PRESET_LOCATIONS.map((preset) => {
          const isSelected =
            Math.abs(preset.lat - latitude) < 0.015 && Math.abs(preset.lng - longitude) < 0.015;
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

      {/* Interactive Real Map Container (Stacking Context Isolated) */}
      <div className="bg-warm-100 relative isolate z-0 h-72 w-full overflow-hidden sm:h-80">
        <div
          ref={mapContainerRef}
          className="relative z-0 h-full w-full"
          aria-label="Peta interaktif penentuan titik koordinat usulan. Klik peta atau geser marker untuk mengubah lokasi."
        />

        {/* SSR / Hydration Loading Placeholder */}
        {!isMapReady ? (
          <div className="bg-warm-100/95 absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 text-slate-500">
            <LoaderCircle className="text-accent-500 h-6 w-6 animate-spin" aria-hidden="true" />
            <span className="text-xs font-semibold">Memuat peta interaktif Kabupaten Tapin...</span>
          </div>
        ) : null}

        {/* Ambient Map Landmark Label */}
        <div className="pointer-events-none absolute top-3 left-3 z-10">
          <div className="bg-darknavy-900/80 flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-white shadow-sm backdrop-blur-xs">
            <Compass className="text-accent-500 h-3 w-3 shrink-0" aria-hidden="true" />
            <span className="text-2xs font-bold tracking-wider uppercase">
              Rantau • Tapin Tengah • Binuang
            </span>
          </div>
        </div>

        {/* Network Tile Warning */}
        {hasTileError ? (
          <div className="absolute top-3 right-3 z-10">
            <div className="text-2xs flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50/95 px-2.5 py-1 font-semibold text-amber-800 shadow-sm backdrop-blur-xs">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-600" aria-hidden="true" />
              <span>Lapisan peta lambat dimuat; klik peta tetap aktif</span>
            </div>
          </div>
        ) : null}

        {/* Floating Zoom Controls (Positioned above bottom-right attribution) */}
        <div className="absolute right-3 bottom-7 z-10 flex flex-col items-end gap-2">
          <div className="border-warm-300 flex flex-col rounded-lg border bg-white/95 shadow-md backdrop-blur-xs">
            <button
              type="button"
              onClick={() => mapRef.current?.zoomIn()}
              disabled={zoomLevel >= 19}
              title="Perbesar Peta"
              className="text-darknavy-900 hover:bg-warm-100 flex h-7 w-7 items-center justify-center rounded-t-lg transition-colors disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <div className="border-warm-200 border-t" />
            <button
              type="button"
              onClick={() => mapRef.current?.zoomOut()}
              disabled={zoomLevel <= 10}
              title="Perkecil Peta"
              className="text-darknavy-900 hover:bg-warm-100 flex h-7 w-7 items-center justify-center rounded-b-lg transition-colors disabled:opacity-40"
            >
              <Minus className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Floating Click / Drag Instruction */}
        <div className="pointer-events-none absolute bottom-3 left-3 z-10 hidden sm:block">
          <div className="bg-darknavy-900/85 text-warm-100 text-2xs flex items-center gap-1.5 rounded-md px-2.5 py-1 shadow-sm backdrop-blur-xs">
            <Crosshair className="text-accent-500 h-3 w-3 shrink-0" aria-hidden="true" />
            <span>Klik peta atau geser pin coral untuk menyesuaikan titik lokasi</span>
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

        {isWithinTapin ? (
          <div className="text-2xs flex items-center gap-1.5 text-slate-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Status: Berada di wilayah Kabupaten Tapin</span>
          </div>
        ) : (
          <div className="text-2xs flex items-center gap-2 text-amber-700">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-600" aria-hidden="true" />
            <span className="font-semibold">Di luar batas Kab. Tapin</span>
            <button
              type="button"
              onClick={() => focusCoords(TAPIN_CENTER.lat, TAPIN_CENTER.lng, 14)}
              className="rounded-full border border-amber-300 bg-white px-2 py-0.5 font-bold text-amber-800 transition-colors hover:bg-amber-50"
            >
              Kembali ke Tapin
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
