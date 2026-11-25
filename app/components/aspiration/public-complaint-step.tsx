import { useId, useState } from 'react';

import { complaintStepSchema, flattenZodFieldErrors } from '~/schema/form';

import { MapPicker } from '@/components/aspiration/map-picker';
import { PhotoDropzone } from '@/components/aspiration/photo-dropzone';
import { RegionSelectorFields } from '@/components/aspiration/region-selector-fields';
import { SupportingDocumentField } from '@/components/aspiration/supporting-document-field';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import type { PublicComplaintFormData } from '@/types/aspiration';

import { CATEGORIES, EXTENDED_AGENCIES } from '@/constants/aspirations';
import { KECAMATAN_TAPIN_LIST } from '@/constants/tapin';

import { ArrowLeft, FileText, HelpCircle, Send } from 'lucide-react';

interface PublicComplaintStepProps {
  data: PublicComplaintFormData;
  onChange: (updates: Partial<PublicComplaintFormData>) => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export function PublicComplaintStep({
  data,
  onChange,
  onBack,
  onSubmit,
  isSubmitting,
}: PublicComplaintStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleKecamatanChange = (kecamatan: string) => {
    onChange({
      kecamatan,
      kelurahan: '',
    });
    if (errors.kecamatan) setErrors((prev) => ({ ...prev, kecamatan: '' }));
    if (errors.kelurahan) setErrors((prev) => ({ ...prev, kelurahan: '' }));
  };

  const handleValidateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = complaintStepSchema.safeParse(data);

    if (!result.success) {
      setErrors(flattenZodFieldErrors(result));
      window.scrollTo({ top: 150, behavior: 'smooth' });
      return;
    }

    setErrors({});
    onSubmit(e);
  };

  const tooltipKomisiId = useId();
  const tooltipKategoriId = useId();
  const tooltipJudulId = useId();
  const tooltipMasalahId = useId();
  const tooltipPetaId = useId();
  const tooltipAlamatId = useId();
  const tooltipDokumenId = useId();

  return (
    <TooltipProvider delayDuration={150}>
      <Card className="soft-card border-warm-200 overflow-hidden rounded-3xl shadow-xl">
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleValidateSubmit} noValidate className="space-y-7">
            {/* FIELD 1: KOMISI DPRD & KATEGORI */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Komisi / Bagian DPRD */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <label
                    htmlFor="agency-select"
                    className="text-darknavy-900 block text-xs font-bold sm:text-sm"
                  >
                    Tujuan Komisi / Bidang DPRD <span className="text-rose-500">*</span>
                  </label>
                  {/* Tooltip */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        id={tooltipKomisiId}
                        aria-label="Petunjuk Komisi / Bidang DPRD"
                        className="hover:bg-warm-100 hover:text-accent-500 focus:ring-accent-500/40 rounded-full p-0.5 text-slate-400 transition-colors focus:ring-2 focus:outline-none"
                      >
                        <HelpCircle className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="start">
                      <div className="flex items-center gap-2">
                        <span className="bg-accent-500 h-2 w-2 shrink-0 rounded-full" />
                        <p className="text-sm font-bold text-white">Komisi & Bidang DPRD</p>
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-300 sm:text-sm">
                        Pilih komisi atau bagian di DPRD Tapin yang mengawasi bidang aduan ini.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                <Select
                  value={data.agency}
                  onValueChange={(val) => {
                    onChange({ agency: val });
                    if (errors.agency) setErrors((prev) => ({ ...prev, agency: '' }));
                  }}
                >
                  <SelectTrigger
                    id="agency-select"
                    aria-invalid={Boolean(errors.agency)}
                    aria-describedby={errors.agency ? 'agency-error' : undefined}
                    className={`border-warm-200 bg-white ${
                      errors.agency ? 'border-rose-500 focus-visible:ring-rose-500' : ''
                    }`}
                  >
                    <SelectValue placeholder="Pilih Komisi / Bidang DPRD" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXTENDED_AGENCIES.map((agency) => (
                      <SelectItem key={agency} value={agency}>
                        {agency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.agency ? (
                  <p id="agency-error" className="text-2xs font-semibold text-rose-500">
                    {errors.agency}
                  </p>
                ) : null}
              </div>

              {/* Kategori */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <label
                    htmlFor="category-select"
                    className="text-darknavy-900 block text-xs font-bold sm:text-sm"
                  >
                    Kategori Aduan <span className="text-rose-500">*</span>
                  </label>
                  {/* Tooltip */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        id={tooltipKategoriId}
                        aria-label="Petunjuk Kategori"
                        className="hover:bg-warm-100 hover:text-accent-500 focus:ring-accent-500/40 rounded-full p-0.5 text-slate-400 transition-colors focus:ring-2 focus:outline-none"
                      >
                        <HelpCircle className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="start">
                      <div className="flex items-center gap-2">
                        <span className="bg-accent-500 h-2 w-2 shrink-0 rounded-full" />
                        <p className="text-sm font-bold text-white">Kategori Pelayanan</p>
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-300 sm:text-sm">
                        Pilih kategori agar laporan terindeks ke bidang teknis yang tepat.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                <Select
                  value={data.category}
                  onValueChange={(val) => {
                    onChange({ category: val });
                    if (errors.category) setErrors((prev) => ({ ...prev, category: '' }));
                  }}
                >
                  <SelectTrigger
                    id="category-select"
                    aria-invalid={Boolean(errors.category)}
                    aria-describedby={errors.category ? 'category-error' : undefined}
                    className={`border-warm-200 bg-white ${
                      errors.category ? 'border-rose-500 focus-visible:ring-rose-500' : ''
                    }`}
                  >
                    <SelectValue placeholder="Pilih Kategori Aduan" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.filter((c) => c !== 'semua').map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category ? (
                  <p id="category-error" className="text-2xs font-semibold text-rose-500">
                    {errors.category}
                  </p>
                ) : null}
              </div>
            </div>

            {/* FIELD 2: JUDUL ADUAN */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <label
                  htmlFor="complaint-title-input"
                  className="text-darknavy-900 block text-xs font-bold sm:text-sm"
                >
                  Judul Keluhan / Aduan <span className="text-rose-500">*</span>
                </label>
                {/* Tooltip */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      id={tooltipJudulId}
                      aria-label="Petunjuk Judul"
                      className="hover:bg-warm-100 hover:text-accent-500 focus:ring-accent-500/40 rounded-full p-0.5 text-slate-400 transition-colors focus:ring-2 focus:outline-none"
                    >
                      <HelpCircle className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="start">
                    <div className="flex items-center gap-2">
                      <span className="bg-accent-500 h-2 w-2 shrink-0 rounded-full" />
                      <p className="text-sm font-bold text-white">Ringkasan Masalah</p>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-300 sm:text-sm">
                      Buat judul singkat dan spesifik, misalnya: Jalan Berlubang di Depan Puskesmas
                      Binuang.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <Input
                id="complaint-title-input"
                type="text"
                required
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? 'title-error' : undefined}
                value={data.title}
                onChange={(e) => {
                  onChange({ title: e.target.value });
                  if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                }}
                placeholder="Contoh: Penerangan jalan mati total di sepanjang Jl. Brigjend H. Hasan Basry"
                className={`border-warm-200 bg-white ${
                  errors.title ? 'border-rose-500 focus-visible:ring-rose-500' : ''
                }`}
              />
              {errors.title ? (
                <p id="title-error" className="text-2xs font-semibold text-rose-500">
                  {errors.title}
                </p>
              ) : null}
            </div>

            {/* FIELD 3: RINCIAN KELUHAN */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <label
                  htmlFor="complaint-content-input"
                  className="text-darknavy-900 block text-xs font-bold sm:text-sm"
                >
                  Isi Detail Aduan & Kronologi Kejadian <span className="text-rose-500">*</span>
                </label>
                {/* Tooltip */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      id={tooltipMasalahId}
                      aria-label="Petunjuk Rincian"
                      className="hover:bg-warm-100 hover:text-accent-500 focus:ring-accent-500/40 rounded-full p-0.5 text-slate-400 transition-colors focus:ring-2 focus:outline-none"
                    >
                      <HelpCircle className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="start">
                    <div className="flex items-center gap-2">
                      <span className="bg-accent-500 h-2 w-2 shrink-0 rounded-full" />
                      <p className="text-sm font-bold text-white">Kronologi & Dampak</p>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-300 sm:text-sm">
                      Jelaskan kronologi kejadian secara terperinci, sejak kapan masalah
                      berlangsung, dan dampaknya bagi warga.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <Textarea
                id="complaint-content-input"
                required
                aria-invalid={Boolean(errors.content)}
                aria-describedby={errors.content ? 'content-error' : undefined}
                rows={4}
                value={data.content}
                onChange={(e) => {
                  onChange({ content: e.target.value });
                  if (errors.content) setErrors((prev) => ({ ...prev, content: '' }));
                }}
                placeholder="Jelaskan secara rinci kronologi kejadian, sejak kapan masalah berlangsung, dan bagaimana dampaknya bagi keselamatan atau kenyamanan masyarakat..."
                className={`border-warm-200 bg-white ${
                  errors.content ? 'border-rose-500 focus-visible:ring-rose-500' : ''
                }`}
              />
              <div className="text-2xs flex items-center justify-between text-slate-400">
                <span>Sebutkan waktu kejadian dan kondisi saat ini.</span>
                <span>{data.content.length} karakter</span>
              </div>
              {errors.content ? (
                <p id="content-error" className="text-2xs font-semibold text-rose-500">
                  {errors.content}
                </p>
              ) : null}
            </div>

            {/* FIELD 4: PETA LOKASI */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <label className="text-darknavy-900 block text-xs font-bold sm:text-sm">
                  Peta Lokasi Kejadian <span className="text-rose-500">*</span>
                </label>
                {/* Tooltip */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      id={tooltipPetaId}
                      aria-label="Petunjuk Peta"
                      className="hover:bg-warm-100 hover:text-accent-500 focus:ring-accent-500/40 rounded-full p-0.5 text-slate-400 transition-colors focus:ring-2 focus:outline-none"
                    >
                      <HelpCircle className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="start">
                    <div className="flex items-center gap-2">
                      <span className="bg-accent-500 h-2 w-2 shrink-0 rounded-full" />
                      <p className="text-sm font-bold text-white">Titik Kejadian</p>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-300 sm:text-sm">
                      Tandai lokasi di peta Tapin untuk memudahkan peninjauan lapangan tim
                      pengawasan DPRD.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <MapPicker
                latitude={data.latitude}
                longitude={data.longitude}
                selectedDistrict={data.kecamatan}
                onChange={({ lat, lng }) => {
                  onChange({ latitude: lat, longitude: lng });
                }}
              />
            </div>

            {/* FIELD 5: ALAMAT LOKASI DETAIL */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <label
                  htmlFor="complaint-address-input"
                  className="text-darknavy-900 block text-xs font-bold sm:text-sm"
                >
                  Alamat Detail Lokasi Kejadian <span className="text-rose-500">*</span>
                </label>
                {/* Tooltip */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      id={tooltipAlamatId}
                      aria-label="Petunjuk Alamat"
                      className="hover:bg-warm-100 hover:text-accent-500 focus:ring-accent-500/40 rounded-full p-0.5 text-slate-400 transition-colors focus:ring-2 focus:outline-none"
                    >
                      <HelpCircle className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="start">
                    <div className="flex items-center gap-2">
                      <span className="bg-accent-500 h-2 w-2 shrink-0 rounded-full" />
                      <p className="text-sm font-bold text-white">Patokan Lokasi</p>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-300 sm:text-sm">
                      Tuliskan alamat lengkap beserta patokan toko, gedung, atau tanda visual di
                      dekat lokasi.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <Textarea
                id="complaint-address-input"
                required
                aria-invalid={Boolean(errors.alamatLokasi)}
                aria-describedby={errors.alamatLokasi ? 'complaint-address-error' : undefined}
                rows={2}
                value={data.alamatLokasi}
                onChange={(e) => {
                  onChange({ alamatLokasi: e.target.value });
                  if (errors.alamatLokasi) setErrors((prev) => ({ ...prev, alamatLokasi: '' }));
                }}
                placeholder="Contoh: Jl. Trans Kalimantan Km 3, Depan Kantor Desa Tungkap, RT 02 / RW 01"
                className={`border-warm-200 bg-white ${
                  errors.alamatLokasi ? 'border-rose-500 focus-visible:ring-rose-500' : ''
                }`}
              />
              {errors.alamatLokasi ? (
                <p id="complaint-address-error" className="text-2xs font-semibold text-rose-500">
                  {errors.alamatLokasi}
                </p>
              ) : null}
            </div>

            {/* ADMINISTRATIVE REGION: KABUPATEN, KECAMATAN, KELURAHAN */}
            <RegionSelectorFields
              idPrefix="complaint"
              kabupaten={data.kabupaten}
              kecamatan={data.kecamatan}
              kelurahan={data.kelurahan}
              districts={KECAMATAN_TAPIN_LIST}
              kecamatanError={errors.kecamatan}
              kelurahanError={errors.kelurahan}
              onKecamatanChange={handleKecamatanChange}
              onKelurahanChange={(val) => {
                onChange({ kelurahan: val });
                if (errors.kelurahan) setErrors((prev) => ({ ...prev, kelurahan: '' }));
              }}
            />

            {/* FIELD 6: BUKTI FOTO & DOKUMEN */}
            <div className="border-warm-200 bg-warm-50/60 space-y-4 rounded-3xl border p-5">
              <div className="border-warm-200 flex items-center justify-between border-b pb-2.5">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-darknavy-900 flex items-center gap-2 text-xs font-extrabold sm:text-sm">
                    <FileText className="text-accent-500 h-4 w-4" />
                    <span>Upload Foto Bukti Kejadian & Dokumen</span>
                  </h3>
                  {/* Tooltip */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        id={tooltipDokumenId}
                        aria-label="Petunjuk Lampiran"
                        className="hover:bg-warm-100 hover:text-accent-500 focus:ring-accent-500/40 rounded-full p-0.5 text-slate-400 transition-colors focus:ring-2 focus:outline-none"
                      >
                        <HelpCircle className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="start">
                      <div className="flex items-center gap-2">
                        <span className="bg-accent-500 h-2 w-2 shrink-0 rounded-full" />
                        <p className="text-sm font-bold text-white">Bukti Foto Autentik</p>
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-300 sm:text-sm">
                        Foto nyata kondisi di lapangan mempercepat verifikasi dan tindak lanjut
                        laporan Anda.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <span className="text-xs font-medium text-slate-500">
                  Maks. 5MB / Foto (Kompresi Otomatis)
                </span>
              </div>

              {/* Foto Bukti Kejadian Dropzone */}
              <PhotoDropzone
                photos={data.photos || []}
                onChange={(photos) => onChange({ photos })}
                error={errors.photos}
                label="Foto Bukti Kejadian"
                helperText="Format: JPG, PNG, atau WebP. Maksimal 3 foto (kompresi otomatis maks. 5MB)."
              />

              {/* Surat / Dokumen Pendukung */}
              <SupportingDocumentField
                id="complaint-doc-input"
                label="Dokumen / Berkas Lampiran Lainnya"
                placeholder="Lampiran.pdf (Belum ada file)"
                fileName={data.documentFileName}
                error={errors.document}
                onFileSelect={(file) => {
                  onChange({ documentFileName: file.name, documentFile: file });
                  if (errors.document) setErrors((prev) => ({ ...prev, document: '' }));
                }}
                onClear={() => onChange({ documentFileName: '', documentFile: null })}
                onError={(message) => setErrors((prev) => ({ ...prev, document: message }))}
              />
            </div>

            {/* Action Buttons */}
            <div className="border-warm-200 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="border-warm-300 text-darknavy-900 hover:bg-warm-100 flex w-full items-center gap-2 rounded-full bg-white px-5 py-5 text-xs font-bold sm:w-auto"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                <span>Kembali ke Data Diri</span>
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="coral-glow bg-accent-500 hover:bg-accent-600 flex w-full items-center justify-center gap-2 rounded-full px-8 py-5 text-xs font-bold text-white shadow-xl transition-all sm:w-auto"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                <span>
                  {isSubmitting ? 'Mengirim Aduan Masyarakat...' : 'Simpan & Kirim Aduan'}
                </span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
