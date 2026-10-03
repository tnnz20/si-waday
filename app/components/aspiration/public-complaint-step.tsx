import { useId, useRef, useState } from 'react';

import { MapPicker } from '@/components/aspiration/map-picker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { DESA_KELURAHAN_TAPIN_MAP, KECAMATAN_TAPIN_LIST } from '@/constants/tapin';

import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  HelpCircle,
  Image as ImageIcon,
  Megaphone,
  Send,
  Trash2,
} from 'lucide-react';

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

  const documentInputRef = useRef<HTMLInputElement | null>(null);
  const photo1InputRef = useRef<HTMLInputElement | null>(null);
  const photo2InputRef = useRef<HTMLInputElement | null>(null);
  const photo3InputRef = useRef<HTMLInputElement | null>(null);

  const availableVillages = data.kecamatan ? DESA_KELURAHAN_TAPIN_MAP[data.kecamatan] || [] : [];

  const handleKecamatanChange = (kecamatan: string) => {
    const villages = DESA_KELURAHAN_TAPIN_MAP[kecamatan] || [];
    onChange({
      kecamatan,
      kelurahan: villages[0] || '',
    });
    if (errors.kecamatan) setErrors((prev) => ({ ...prev, kecamatan: '' }));
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, document: 'Ukuran dokumen maksimal 10MB.' }));
      return;
    }
    onChange({ documentFileName: file.name });
    if (errors.document) setErrors((prev) => ({ ...prev, document: '' }));
  };

  const handlePhotoUpload = (index: 1 | 2 | 3, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, [`photo${index}`]: 'Ukuran foto maksimal 8MB.' }));
      return;
    }

    if (index === 1 && data.photo1PreviewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(data.photo1PreviewUrl);
    } else if (index === 2 && data.photo2PreviewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(data.photo2PreviewUrl);
    } else if (index === 3 && data.photo3PreviewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(data.photo3PreviewUrl);
    }

    const previewUrl = URL.createObjectURL(file);
    if (index === 1) {
      onChange({ photo1FileName: file.name, photo1PreviewUrl: previewUrl });
    } else if (index === 2) {
      onChange({ photo2FileName: file.name, photo2PreviewUrl: previewUrl });
    } else {
      onChange({ photo3FileName: file.name, photo3PreviewUrl: previewUrl });
    }
  };

  const handleRemovePhoto = (index: 1 | 2 | 3) => {
    if (index === 1) {
      if (data.photo1PreviewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(data.photo1PreviewUrl);
      }
      onChange({ photo1FileName: '', photo1PreviewUrl: '' });
      if (photo1InputRef.current) photo1InputRef.current.value = '';
    } else if (index === 2) {
      if (data.photo2PreviewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(data.photo2PreviewUrl);
      }
      onChange({ photo2FileName: '', photo2PreviewUrl: '' });
      if (photo2InputRef.current) photo2InputRef.current.value = '';
    } else {
      if (data.photo3PreviewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(data.photo3PreviewUrl);
      }
      onChange({ photo3FileName: '', photo3PreviewUrl: '' });
      if (photo3InputRef.current) photo3InputRef.current.value = '';
    }
  };

  const handleValidateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!data.agency) {
      newErrors.agency = 'Tujuan komisi / bidang pengawasan DPRD wajib dipilih.';
    }
    if (!data.category) {
      newErrors.category = 'Kategori aduan wajib dipilih.';
    }
    if (!data.title.trim()) {
      newErrors.title = 'Judul keluhan / aduan wajib diisi.';
    }
    if (!data.content.trim()) {
      newErrors.content = 'Rincian aduan wajib dijelaskan secara jelas.';
    }
    if (!data.alamatLokasi.trim()) {
      newErrors.alamatLokasi = 'Alamat spesifik lokasi kejadian wajib diisi.';
    }
    if (!data.kecamatan) {
      newErrors.kecamatan = 'Kecamatan wajib dipilih.';
    }
    if (!data.kelurahan) {
      newErrors.kelurahan = 'Kelurahan / Desa wajib dipilih.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
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
        {/* Header section */}
        <CardHeader className="bg-darknavy-900 p-6 text-white sm:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="bg-accent-500 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg">
                <Megaphone className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-accent-500/20 text-accent-500 border-accent-500/40 text-2xs rounded-full border px-2.5 py-0.5 font-extrabold tracking-wider uppercase">
                    Langkah 2 dari 2
                  </span>
                  <span className="text-xs text-slate-400">Pengawasan DPRD Kab. Tapin</span>
                </div>
                <CardTitle className="mt-1 text-xl font-extrabold text-white sm:text-2xl">
                  FORMULIR ADUAN MASYARAKAT
                </CardTitle>
                <CardDescription className="text-xs text-slate-300">
                  Penyampaian keluhan fasilitas publik, jalan rusak, sampah, dan ketertiban kota
                </CardDescription>
              </div>
            </div>

            <div className="border-darknavy-800 bg-darknavy-800/80 text-2xs flex items-center gap-2 rounded-2xl border px-3.5 py-2 text-slate-300">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
              <span>SLA Tindak Lanjut &lt; 24 Jam</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleValidateSubmit} className="space-y-7">
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
                    className={`border-warm-200 bg-white ${
                      errors.agency ? 'border-rose-400 focus:ring-rose-400' : ''
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
                  <p className="text-2xs font-semibold text-rose-500">{errors.agency}</p>
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
                    className={`border-warm-200 bg-white ${
                      errors.category ? 'border-rose-400 focus:ring-rose-400' : ''
                    }`}
                  >
                    <SelectValue placeholder="Pilih Kategori" />
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
                  <p className="text-2xs font-semibold text-rose-500">{errors.category}</p>
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
                value={data.title}
                onChange={(e) => {
                  onChange({ title: e.target.value });
                  if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                }}
                placeholder="Contoh: Penerangan jalan mati total di sepanjang Jl. Brigjend H. Hasan Basry"
                className={`border-warm-200 bg-white ${
                  errors.title ? 'border-rose-400 focus:ring-rose-400' : ''
                }`}
              />
              {errors.title ? (
                <p className="text-2xs font-semibold text-rose-500">{errors.title}</p>
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
                rows={4}
                value={data.content}
                onChange={(e) => {
                  onChange({ content: e.target.value });
                  if (errors.content) setErrors((prev) => ({ ...prev, content: '' }));
                }}
                placeholder="Jelaskan secara rinci kronologi kejadian, sejak kapan masalah berlangsung, dan bagaimana dampaknya bagi keselamatan atau kenyamanan masyarakat..."
                className={`border-warm-200 bg-white ${
                  errors.content ? 'border-rose-400 focus:ring-rose-400' : ''
                }`}
              />
              <div className="text-2xs flex items-center justify-between text-slate-400">
                <span>Sebutkan waktu kejadian dan kondisi saat ini.</span>
                <span>{data.content.length} karakter</span>
              </div>
              {errors.content ? (
                <p className="text-2xs font-semibold text-rose-500">{errors.content}</p>
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
                rows={2}
                value={data.alamatLokasi}
                onChange={(e) => {
                  onChange({ alamatLokasi: e.target.value });
                  if (errors.alamatLokasi) setErrors((prev) => ({ ...prev, alamatLokasi: '' }));
                }}
                placeholder="Contoh: Jl. Trans Kalimantan Km 3, Depan Kantor Desa Tungkap, RT 02 / RW 01"
                className={`border-warm-200 bg-white ${
                  errors.alamatLokasi ? 'border-rose-400 focus:ring-rose-400' : ''
                }`}
              />
              {errors.alamatLokasi ? (
                <p className="text-2xs font-semibold text-rose-500">{errors.alamatLokasi}</p>
              ) : null}
            </div>

            {/* ADMINISTRATIVE REGION: KABUPATEN, KECAMATAN, KELURAHAN */}
            <div className="border-warm-200 bg-warm-50/50 space-y-4 rounded-2xl border p-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Kabupaten */}
                <div>
                  <label
                    htmlFor="complaint-kabupaten-select"
                    className="text-darknavy-900 mb-1.5 block text-xs font-bold"
                  >
                    Kabupaten / Kota <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    id="complaint-kabupaten-select"
                    type="text"
                    readOnly
                    value={data.kabupaten}
                    className="border-warm-200 bg-warm-100 text-darknavy-900 cursor-not-allowed text-xs font-semibold"
                  />
                </div>

                {/* Kecamatan */}
                <div>
                  <label
                    htmlFor="complaint-kecamatan-select"
                    className="text-darknavy-900 mb-1.5 block text-xs font-bold"
                  >
                    Kecamatan <span className="text-rose-500">*</span>
                  </label>
                  <Select value={data.kecamatan} onValueChange={handleKecamatanChange}>
                    <SelectTrigger
                      id="complaint-kecamatan-select"
                      className={`border-warm-200 bg-white text-xs ${
                        errors.kecamatan ? 'border-rose-400 focus:ring-rose-400' : ''
                      }`}
                    >
                      <SelectValue placeholder="Pilih Kecamatan" />
                    </SelectTrigger>
                    <SelectContent>
                      {KECAMATAN_TAPIN_LIST.map((kec) => (
                        <SelectItem key={kec} value={kec}>
                          Kecamatan {kec}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.kecamatan ? (
                    <p className="text-2xs mt-1 font-semibold text-rose-500">{errors.kecamatan}</p>
                  ) : null}
                </div>

                {/* Kelurahan / Desa */}
                <div>
                  <label
                    htmlFor="complaint-kelurahan-select"
                    className="text-darknavy-900 mb-1.5 block text-xs font-bold"
                  >
                    Kelurahan / Desa <span className="text-rose-500">*</span>
                  </label>
                  <Select
                    value={data.kelurahan}
                    onValueChange={(val) => {
                      onChange({ kelurahan: val });
                      if (errors.kelurahan) setErrors((prev) => ({ ...prev, kelurahan: '' }));
                    }}
                  >
                    <SelectTrigger
                      id="complaint-kelurahan-select"
                      className={`border-warm-200 bg-white text-xs ${
                        errors.kelurahan ? 'border-rose-400 focus:ring-rose-400' : ''
                      }`}
                    >
                      <SelectValue placeholder="Pilih Desa" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableVillages.map((desa) => (
                        <SelectItem key={desa} value={desa}>
                          {desa}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.kelurahan ? (
                    <p className="text-2xs mt-1 font-semibold text-rose-500">{errors.kelurahan}</p>
                  ) : null}
                </div>
              </div>
            </div>

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
                <span className="text-xs font-medium text-slate-500">Maks. 8MB / Foto</span>
              </div>

              {/* Hidden file inputs */}
              <input
                type="file"
                ref={documentInputRef}
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleDocumentUpload}
              />
              <input
                type="file"
                ref={photo1InputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => handlePhotoUpload(1, e)}
              />
              <input
                type="file"
                ref={photo2InputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => handlePhotoUpload(2, e)}
              />
              <input
                type="file"
                ref={photo3InputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => handlePhotoUpload(3, e)}
              />

              {/* Foto Bukti 1-3 Grid */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {/* Foto 1 */}
                <div className="space-y-1">
                  <label className="text-darknavy-900 text-2xs block font-bold">
                    Foto Bukti 1 <span className="text-rose-500">*</span>
                  </label>
                  <div className="border-warm-300 flex items-center justify-between rounded-xl border bg-white p-2 shadow-2xs">
                    <div className="flex min-w-0 items-center gap-2 truncate pr-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => photo1InputRef.current?.click()}
                        className="border-warm-300 bg-warm-100 hover:bg-warm-200 text-darknavy-900 h-7 shrink-0 rounded-lg px-2 text-xs"
                      >
                        Browse...
                      </Button>
                      {data.photo1PreviewUrl ? (
                        <img
                          src={data.photo1PreviewUrl}
                          alt="Foto Bukti 1"
                          className="border-warm-200 h-6 w-6 shrink-0 rounded border object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-4 w-4 shrink-0 text-slate-400" />
                      )}
                      <span className="text-2xs truncate font-mono text-slate-700">
                        {data.photo1FileName || 'Gambar.png'}
                      </span>
                    </div>
                    {data.photo1PreviewUrl ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePhoto(1)}
                        className="h-6 w-6 shrink-0 p-0 text-rose-500 hover:bg-rose-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    ) : null}
                  </div>
                </div>

                {/* Foto 2 */}
                <div className="space-y-1">
                  <label className="text-darknavy-900 text-2xs block font-bold">
                    Foto Bukti 2 (opsional)
                  </label>
                  <div className="border-warm-300 flex items-center justify-between rounded-xl border bg-white p-2 shadow-2xs">
                    <div className="flex min-w-0 items-center gap-2 truncate pr-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => photo2InputRef.current?.click()}
                        className="border-warm-300 bg-warm-100 hover:bg-warm-200 text-darknavy-900 h-7 shrink-0 rounded-lg px-2 text-xs"
                      >
                        Browse...
                      </Button>
                      {data.photo2PreviewUrl ? (
                        <img
                          src={data.photo2PreviewUrl}
                          alt="Foto Bukti 2"
                          className="border-warm-200 h-6 w-6 shrink-0 rounded border object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-4 w-4 shrink-0 text-slate-400" />
                      )}
                      <span className="text-2xs truncate font-mono text-slate-700">
                        {data.photo2FileName || 'Gambar.png'}
                      </span>
                    </div>
                    {data.photo2PreviewUrl ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePhoto(2)}
                        className="h-6 w-6 shrink-0 p-0 text-rose-500 hover:bg-rose-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    ) : null}
                  </div>
                </div>

                {/* Foto 3 */}
                <div className="space-y-1">
                  <label className="text-darknavy-900 text-2xs block font-bold">
                    Foto Bukti 3 (opsional)
                  </label>
                  <div className="border-warm-300 flex items-center justify-between rounded-xl border bg-white p-2 shadow-2xs">
                    <div className="flex min-w-0 items-center gap-2 truncate pr-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => photo3InputRef.current?.click()}
                        className="border-warm-300 bg-warm-100 hover:bg-warm-200 text-darknavy-900 h-7 shrink-0 rounded-lg px-2 text-xs"
                      >
                        Browse...
                      </Button>
                      {data.photo3PreviewUrl ? (
                        <img
                          src={data.photo3PreviewUrl}
                          alt="Foto Bukti 3"
                          className="border-warm-200 h-6 w-6 shrink-0 rounded border object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-4 w-4 shrink-0 text-slate-400" />
                      )}
                      <span className="text-2xs truncate font-mono text-slate-700">
                        {data.photo3FileName || 'Gambar.png'}
                      </span>
                    </div>
                    {data.photo3PreviewUrl ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePhoto(3)}
                        className="h-6 w-6 shrink-0 p-0 text-rose-500 hover:bg-rose-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Surat / Dokumen Pendukung */}
              <div className="space-y-1 pt-1">
                <label className="text-darknavy-900 block text-xs font-bold">
                  Dokumen / Berkas Lampiran Lainnya{' '}
                  <span className="font-normal text-slate-400">(opsional)</span>
                </label>
                <div className="border-warm-300 flex items-center justify-between rounded-xl border bg-white p-2 shadow-2xs">
                  <div className="flex min-w-0 items-center gap-2 pr-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => documentInputRef.current?.click()}
                      className="border-warm-300 bg-warm-100 hover:bg-warm-200 text-darknavy-900 shrink-0 rounded-lg text-xs"
                    >
                      Browse...
                    </Button>
                    <span className="truncate font-mono text-xs text-slate-700">
                      {data.documentFileName || 'Lampiran.pdf (Belum ada file)'}
                    </span>
                  </div>

                  {data.documentFileName ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onChange({ documentFileName: '' })}
                      className="h-8 w-8 p-0 text-rose-500 hover:bg-rose-50 hover:text-rose-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  ) : null}
                </div>
              </div>
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
