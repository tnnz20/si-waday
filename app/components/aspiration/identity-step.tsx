import { useRef, useState } from 'react';

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

import type { AspirationType, IdentityFormData } from '@/types/aspiration';

import {
  ArrowRight,
  Camera,
  CheckCircle2,
  FileCheck,
  IdCard,
  Info,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Trash2,
  UploadCloud,
  User,
} from 'lucide-react';

interface IdentityStepProps {
  data: IdentityFormData;
  onChange: (updates: Partial<IdentityFormData>) => void;
  onNext: () => void;
  aspirationType?: AspirationType;
}

export function IdentityStep({
  data,
  onChange,
  onNext,
  aspirationType = 'dapil',
}: IdentityStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Auto-detect Tapin NIK code (6305...)
  const isTapinNik = data.nik.startsWith('6305');

  const handleNikChange = (val: string) => {
    // Only allow numbers and max 16 digits
    const cleaned = val.replace(/\D/g, '').slice(0, 16);
    onChange({ nik: cleaned });
    if (errors.nik) {
      setErrors((prev) => ({ ...prev, nik: '' }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, idCard: 'Ukuran file foto KTP maksimal 5MB.' }));
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    onChange({
      idCardFileName: file.name,
      idCardPreviewUrl: previewUrl,
    });

    if (errors.idCard) {
      setErrors((prev) => ({ ...prev, idCard: '' }));
    }
  };

  const handleRemoveFile = () => {
    onChange({
      idCardFileName: '',
      idCardPreviewUrl: '',
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateAndProceed = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!data.fullName.trim()) {
      newErrors.fullName = 'Nama lengkap wajib diisi sesuai kartu identitas resmi.';
    }

    if (!data.nik.trim()) {
      newErrors.nik = 'Nomor NIK 16 digit wajib diisi.';
    } else if (data.nik.length !== 16) {
      newErrors.nik = 'NIK harus tepat 16 digit angka.';
    }

    if (!data.phone.trim()) {
      newErrors.phone = 'Nomor WhatsApp / HP wajib diisi untuk konfirmasi status tindak lanjut.';
    }

    if (!data.ktpAddress.trim()) {
      newErrors.ktpAddress = 'Alamat tempat tinggal / domisili KTP wajib diisi.';
    }

    if (!data.idCardPreviewUrl && !data.idCardFileName) {
      newErrors.idCard =
        'Foto Kartu Tanda Pengenal (KTP) wajib diunggah untuk verifikasi keabsahan warga.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 180, behavior: 'smooth' });
      return;
    }

    setErrors({});
    onNext();
  };

  const isDapil = aspirationType === 'dapil';

  return (
    <Card className="soft-card border-warm-200 overflow-hidden rounded-3xl shadow-xl">
      {/* Step Header */}
      <CardHeader className="bg-darknavy-900 p-6 text-white sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="bg-accent-500 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg">
              <IdCard className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-accent-500/20 text-accent-500 border-accent-500/40 text-2xs rounded-full border px-2.5 py-0.5 font-extrabold tracking-wider uppercase">
                  Langkah 1 dari 2
                </span>
                <span className="text-xs text-slate-400">
                  {isDapil ? 'Verifikasi Pengusul Dapil' : 'Verifikasi Pelapor Masyarakat'}
                </span>
              </div>
              <CardTitle className="mt-1 text-xl font-extrabold text-white sm:text-2xl">
                Data Diri & Kartu Tanda Pengenal
              </CardTitle>
              <CardDescription className="text-xs text-slate-300">
                {isDapil
                  ? 'Verifikasi keabsahan warga pengusul oleh Sekretariat DPRD Kabupaten Tapin.'
                  : 'Verifikasi identitas resmi pelapor aduan masyarakat DPRD Kabupaten Tapin.'}
              </CardDescription>
            </div>
          </div>

          {/* Privacy & Legitimacy Security Badge */}
          <div className="border-darknavy-800 bg-darknavy-800/80 text-2xs flex items-center gap-2 rounded-2xl border px-3.5 py-2 text-slate-300">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
            <span>Identitas Terverifikasi Resmi</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 sm:p-8">
        <form onSubmit={validateAndProceed} className="space-y-6">
          {/* Identity Requirement Notification Banner */}
          <div className="border-warm-200 bg-warm-100 flex items-center justify-between rounded-2xl border p-4 transition-all">
            <div className="flex items-center gap-3 pr-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                <Lock className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-darknavy-900 block text-xs font-bold sm:text-sm">
                  Kewajiban Identitas Warga Asli
                </p>
                <p className="text-2xs mt-0.5 leading-relaxed text-slate-600">
                  Setiap laporan dan usulan wajib mencantumkan identitas asli yang dapat
                  dipertanggungjawabkan guna mencegah aduan palsu atau penyalahgunaan data.
                </p>
              </div>
            </div>
            <span className="text-2xs shrink-0 rounded-full border border-emerald-300 bg-emerald-100 px-2.5 py-1 font-extrabold text-emerald-800">
              Wajib Valid
            </span>
          </div>

          {/* Form Fields Section */}
          <div className="space-y-4">
            <h3 className="text-darknavy-900 border-warm-200 flex items-center gap-2 border-b pb-2 text-sm font-extrabold">
              <User className="text-accent-500 h-4 w-4" aria-hidden="true" />
              <span>Informasi Personal Pengusul / Pelapor</span>
            </h3>

            {/* Grid: Jenis Identitas & NIK */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="identity-type"
                  className="text-darknavy-900 mb-1.5 block text-xs font-bold"
                >
                  Jenis Tanda Pengenal <span className="text-rose-500">*</span>
                </label>
                <Select
                  value={data.identityType}
                  onValueChange={(val) => onChange({ identityType: val })}
                >
                  <SelectTrigger id="identity-type" className="border-warm-200 bg-white">
                    <SelectValue placeholder="Pilih Jenis Identitas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="e-KTP (Kartu Tanda Penduduk)">
                      e-KTP (Kartu Tanda Penduduk)
                    </SelectItem>
                    <SelectItem value="SIM (Surat Izin Mengemudi)">
                      SIM (Surat Izin Mengemudi)
                    </SelectItem>
                    <SelectItem value="Kartu Keluarga (KK)">Kartu Keluarga (KK)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="nik-input" className="text-darknavy-900 text-xs font-bold">
                    Nomor NIK / No. KTP (16 Digit) <span className="text-rose-500">*</span>
                  </label>
                  {isTapinNik ? (
                    <span className="text-2xs flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 font-bold text-emerald-800">
                      <CheckCircle2 className="h-3 w-3" />
                      Tapin (6305)
                    </span>
                  ) : (
                    <span className="text-2xs text-slate-400">Wajib 16 Digit</span>
                  )}
                </div>
                <Input
                  id="nik-input"
                  type="text"
                  inputMode="numeric"
                  maxLength={16}
                  required
                  value={data.nik}
                  onChange={(e) => handleNikChange(e.target.value)}
                  placeholder="Contoh: 630501xxxxxxxxxx"
                  className={`border-warm-200 bg-white font-mono tracking-wider ${
                    errors.nik ? 'border-rose-400 focus:ring-rose-400' : ''
                  }`}
                />
                {errors.nik ? (
                  <p className="text-2xs mt-1 font-semibold text-rose-500">{errors.nik}</p>
                ) : (
                  <p className="text-2xs mt-1 text-slate-400">
                    Format resmi NIK Kependudukan Kabupaten Tapin (kode 6305).
                  </p>
                )}
              </div>
            </div>

            {/* Grid: Nama Lengkap & WhatsApp */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="full-name-input"
                  className="text-darknavy-900 mb-1.5 block text-xs font-bold"
                >
                  Nama Lengkap Sesuai KTP <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="full-name-input"
                    type="text"
                    required
                    value={data.fullName}
                    onChange={(e) => {
                      onChange({ fullName: e.target.value });
                      if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                    }}
                    placeholder="Contoh: Muhammad Arsyad"
                    className={`border-warm-200 bg-white pl-9 ${
                      errors.fullName ? 'border-rose-400 focus:ring-rose-400' : ''
                    }`}
                  />
                </div>
                {errors.fullName ? (
                  <p className="text-2xs mt-1 font-semibold text-rose-500">{errors.fullName}</p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="phone-input"
                  className="text-darknavy-900 mb-1.5 block text-xs font-bold"
                >
                  Nomor WhatsApp / HP Aktif <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="phone-input"
                    type="tel"
                    required
                    value={data.phone}
                    onChange={(e) => {
                      onChange({ phone: e.target.value });
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                    }}
                    placeholder="Contoh: 0812-3456-7890"
                    className={`border-warm-200 bg-white pl-9 ${
                      errors.phone ? 'border-rose-400 focus:ring-rose-400' : ''
                    }`}
                  />
                </div>
                {errors.phone ? (
                  <p className="text-2xs mt-1 font-semibold text-rose-500">{errors.phone}</p>
                ) : (
                  <p className="text-2xs mt-1 text-slate-400">
                    Digunakan untuk pengiriman notifikasi tindak lanjut resmi.
                  </p>
                )}
              </div>
            </div>

            {/* Email (Optional) */}
            <div>
              <label
                htmlFor="email-input"
                className="text-darknavy-900 mb-1.5 block text-xs font-bold"
              >
                Alamat Email <span className="font-normal text-slate-400">(Opsional)</span>
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email-input"
                  type="email"
                  value={data.email}
                  onChange={(e) => onChange({ email: e.target.value })}
                  placeholder="Contoh: warga.tapin@gmail.com"
                  className="border-warm-200 bg-white pl-9"
                />
              </div>
            </div>

            {/* Alamat Domisili KTP */}
            <div>
              <label
                htmlFor="ktp-address-input"
                className="text-darknavy-900 mb-1.5 block text-xs font-bold"
              >
                Alamat Domisili Sesuai KTP <span className="text-rose-500">*</span>
              </label>
              <Textarea
                id="ktp-address-input"
                required
                rows={2}
                value={data.ktpAddress}
                onChange={(e) => {
                  onChange({ ktpAddress: e.target.value });
                  if (errors.ktpAddress) setErrors((prev) => ({ ...prev, ktpAddress: '' }));
                }}
                placeholder="Contoh: Jl. Brigjend H. Hasan Basry No. 12, RT 04 / RW 02, Rantau Kiwa, Kec. Tapin Utara"
                className={`border-warm-200 bg-white ${
                  errors.ktpAddress ? 'border-rose-400 focus:ring-rose-400' : ''
                }`}
              />
              {errors.ktpAddress ? (
                <p className="text-2xs mt-1 font-semibold text-rose-500">{errors.ktpAddress}</p>
              ) : null}
            </div>
          </div>

          {/* KTP Document Upload Area */}
          <div className="space-y-3 pt-2">
            <div className="border-warm-200 flex items-center justify-between border-b pb-2">
              <h3 className="text-darknavy-900 flex items-center gap-2 text-sm font-extrabold">
                <IdCard className="text-accent-500 h-4 w-4" aria-hidden="true" />
                <span>Upload Kartu Tanda Pengenal Diri (KTP)</span>
                <span className="text-rose-500">*</span>
              </h3>
              <span className="text-2xs text-slate-400">Format: JPG, PNG, PDF (Maks 5MB)</span>
            </div>

            {/* Hidden native input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*,application/pdf"
              className="hidden"
              onChange={handleFileUpload}
            />

            {/* Upload Box / Card Preview */}
            {data.idCardPreviewUrl ? (
              <div className="border-warm-300 bg-warm-50 overflow-hidden rounded-2xl border p-5">
                <div className="flex flex-col items-center gap-5 md:flex-row">
                  {/* Photo Preview of Uploaded ID Card */}
                  <div className="border-warm-200 relative w-full max-w-xs shrink-0 overflow-hidden rounded-2xl border bg-slate-100 shadow-md">
                    {data.idCardFileName.toLowerCase().endsWith('.pdf') ? (
                      <div className="flex h-44 flex-col items-center justify-center gap-2 p-4 text-slate-500">
                        <FileCheck className="h-10 w-10 text-emerald-500" />
                        <span className="text-xs font-semibold">Berkas Dokumen PDF KTP</span>
                      </div>
                    ) : (
                      <img
                        src={data.idCardPreviewUrl}
                        alt="Foto KTP Terunggah"
                        className="h-44 w-full object-cover"
                      />
                    )}
                    <div className="absolute right-2 bottom-2 flex items-center gap-1 rounded-full bg-emerald-600/95 px-2.5 py-0.5 text-xs font-bold text-white shadow-xs">
                      <CheckCircle2 className="h-3 w-3" />
                      Terunggah
                    </div>
                  </div>

                  {/* File Meta Information & Actions */}
                  <div className="w-full flex-1 space-y-2 text-left">
                    <div className="flex items-center gap-2">
                      <FileCheck className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                      <div>
                        <p className="text-darknavy-900 text-xs font-bold sm:text-sm">
                          {data.idCardFileName || 'e-KTP Terunggah'}
                        </p>
                        <p className="text-2xs text-slate-500 sm:text-xs">
                          Dokumen siap diproses untuk verifikasi keabsahan laporan warga.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="border-warm-300 text-darknavy-900 hover:bg-warm-200 rounded-full text-xs font-semibold"
                      >
                        <Camera className="mr-1 h-3.5 w-3.5" />
                        Ganti Foto KTP
                      </Button>

                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleRemoveFile}
                        className="rounded-full text-xs font-semibold"
                      >
                        <Trash2 className="mr-1 h-3.5 w-3.5" />
                        Hapus
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    fileInputRef.current?.click();
                  }
                }}
                className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all sm:p-8 ${
                  errors.idCard
                    ? 'border-rose-400 bg-rose-50/50'
                    : 'border-warm-300 bg-warm-50 hover:bg-warm-100 hover:border-accent-500'
                }`}
              >
                <div className="text-accent-500 mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <UploadCloud className="h-7 w-7" aria-hidden="true" />
                </div>
                <h4 className="text-darknavy-900 text-sm font-bold">
                  Klik untuk Memilih atau Seret Foto KTP ke Sini
                </h4>
                <p className="text-2xs mx-auto mt-1 max-w-md text-slate-500 sm:text-xs">
                  Pastikan foto kartu tanda pengenal (e-KTP / SIM) terlihat jelas, tidak buram, dan
                  nomor NIK terbaca dengan baik.
                </p>

                <div className="mt-4 flex items-center justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-warm-300 text-darknavy-900 pointer-events-none rounded-full bg-white px-5 py-2 text-xs font-bold shadow-2xs"
                  >
                    Pilih File Foto KTP
                  </Button>
                </div>
              </div>
            )}

            {errors.idCard ? (
              <p className="text-2xs font-semibold text-rose-500">{errors.idCard}</p>
            ) : null}
          </div>

          {/* Privacy & Legal Disclaimer */}
          <div className="border-warm-200 bg-warm-50 text-2xs flex items-start gap-3 rounded-2xl border p-4 leading-relaxed text-slate-600">
            <Info className="text-accent-500 mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <div>
              <span className="text-darknavy-900 font-bold">
                Perlindungan Kerahasiaan Data Pribadi:{' '}
              </span>
              Data NIK dan dokumen kartu identitas Anda dilindungi secara ketat berdasarkan
              Undang-Undang No. 27 Tahun 2022 tentang Perlindungan Data Pribadi (PDP). Informasi
              identitas ini semata-mata digunakan untuk validasi keabsahan warga dan tidak akan
              disalahgunakan atau dipublikasikan secara umum.
            </div>
          </div>

          {/* Action Step 1 Navigation */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              className="coral-glow bg-accent-500 hover:bg-accent-600 flex w-full items-center justify-center gap-2 rounded-full px-8 py-5 text-xs font-bold text-white shadow-lg sm:w-auto"
            >
              <span>Lanjut ke Formulir {isDapil ? 'Usulan Aspirasi' : 'Aduan Masyarakat'}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
