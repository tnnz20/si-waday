import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { DESA_KELURAHAN_TAPIN_MAP } from '@/constants/tapin';

interface RegionSelectorFieldsProps {
  idPrefix: string;
  kabupaten: string;
  kabupatenLabel?: string;
  kecamatan: string;
  kelurahan: string;
  districts: string[];
  kecamatanError?: string;
  kelurahanError?: string;
  onKecamatanChange: (kecamatan: string) => void;
  onKelurahanChange: (kelurahan: string) => void;
}

/**
 * Shared Tapin administrative region selector (Kabupaten, Kecamatan, Kelurahan/Desa).
 */
export function RegionSelectorFields({
  idPrefix,
  kabupaten,
  kabupatenLabel = 'Kabupaten / Kota',
  kecamatan,
  kelurahan,
  districts,
  kecamatanError,
  kelurahanError,
  onKecamatanChange,
  onKelurahanChange,
}: RegionSelectorFieldsProps) {
  const availableVillages = kecamatan ? DESA_KELURAHAN_TAPIN_MAP[kecamatan] || [] : [];
  const kecamatanId = `${idPrefix}-kecamatan-select`;
  const kelurahanId = `${idPrefix}-kelurahan-select`;
  const kecamatanErrorId = `${idPrefix}-kecamatan-error`;
  const kelurahanErrorId = `${idPrefix}-kelurahan-error`;

  return (
    <div className="border-warm-200 bg-warm-50/50 space-y-4 rounded-2xl border p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Kabupaten */}
        <div>
          <label
            htmlFor={`${idPrefix}-kabupaten-select`}
            className="text-darknavy-900 mb-1.5 block text-xs font-bold"
          >
            {kabupatenLabel} <span className="text-rose-500">*</span>
          </label>
          <Input
            id={`${idPrefix}-kabupaten-select`}
            type="text"
            readOnly
            value={kabupaten}
            className="border-warm-200 bg-warm-100 text-darknavy-900 cursor-not-allowed text-xs font-semibold"
          />
        </div>

        {/* Kecamatan */}
        <div>
          <label htmlFor={kecamatanId} className="text-darknavy-900 mb-1.5 block text-xs font-bold">
            Kecamatan <span className="text-rose-500">*</span>
          </label>
          <Select value={kecamatan} onValueChange={onKecamatanChange}>
            <SelectTrigger
              id={kecamatanId}
              aria-invalid={Boolean(kecamatanError)}
              aria-describedby={kecamatanError ? kecamatanErrorId : undefined}
              className={`border-warm-200 bg-white text-xs ${
                kecamatanError ? 'border-rose-500 focus-visible:ring-rose-500' : ''
              }`}
            >
              <SelectValue placeholder="Pilih Kecamatan" />
            </SelectTrigger>
            <SelectContent>
              {districts.map((kec) => (
                <SelectItem key={kec} value={kec}>
                  Kecamatan {kec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {kecamatanError ? (
            <p id={kecamatanErrorId} className="text-2xs mt-1 font-semibold text-rose-500">
              {kecamatanError}
            </p>
          ) : null}
        </div>

        {/* Kelurahan / Desa */}
        <div>
          <label htmlFor={kelurahanId} className="text-darknavy-900 mb-1.5 block text-xs font-bold">
            Kelurahan / Desa <span className="text-rose-500">*</span>
          </label>
          <Select disabled={!kecamatan} value={kelurahan} onValueChange={onKelurahanChange}>
            <SelectTrigger
              id={kelurahanId}
              aria-invalid={Boolean(kelurahanError)}
              aria-describedby={kelurahanError ? kelurahanErrorId : undefined}
              className={`border-warm-200 bg-white text-xs ${
                kelurahanError ? 'border-rose-500 focus-visible:ring-rose-500' : ''
              }`}
            >
              <SelectValue
                placeholder={
                  kecamatan ? 'Pilih Kelurahan / Desa' : 'Pilih Kecamatan terlebih dahulu'
                }
              />
            </SelectTrigger>
            <SelectContent>
              {availableVillages.map((desa) => (
                <SelectItem key={desa} value={desa}>
                  {desa}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {kelurahanError ? (
            <p id={kelurahanErrorId} className="text-2xs mt-1 font-semibold text-rose-500">
              {kelurahanError}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
