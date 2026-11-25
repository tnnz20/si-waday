import {
  type GeoCoords,
  KECAMATAN_CENTER_MAP,
  TAPIN_BOUNDS,
  TAPIN_CENTER,
} from '@/constants/tapin';

/**
 * Round a geographic coordinate to fixed decimal places (default: 6 decimals ≈ 0.11m).
 */
export function roundCoord(value: number, precision = 6): number {
  return Number(value.toFixed(precision));
}

/**
 * Check whether a lat/lng pair falls inside the Kabupaten Tapin bounding box.
 */
export function isWithinTapinBounds(lat: number, lng: number): boolean {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return false;
  }
  return (
    lat >= TAPIN_BOUNDS.minLat &&
    lat <= TAPIN_BOUNDS.maxLat &&
    lng >= TAPIN_BOUNDS.minLng &&
    lng <= TAPIN_BOUNDS.maxLng
  );
}

/**
 * Resolve center coordinates for a Tapin kecamatan, falling back to Rantau city center.
 */
export function getDistrictCenter(district?: string): GeoCoords {
  if (!district) {
    return TAPIN_CENTER;
  }
  return KECAMATAN_CENTER_MAP[district] || TAPIN_CENTER;
}
