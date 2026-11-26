import { useId, useState } from 'react';

import { aspirationStepSchema, flattenZodFieldErrors } from '~/schema/form';

import { getInitials } from '@/lib/utils';

import { MapPicker } from '@/components/aspiration/map-picker';
import { PhotoDropzone } from '@/components/aspiration/photo-dropzone';
import { RegionSelectorFields } from '@/components/aspiration/region-selector-fields';
import { SupportingDocumentField } from '@/components/aspiration/supporting-document-field';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

import type { UsulanFormData } from '@/types/aspiration';

import {
  ALL_DAPIL_LIST,
  type AnggotaDprdTapin,
  type DapilTapin,
  KAMUS_USULAN_LIST,
  KECAMATAN_TAPIN_LIST,
} from '@/constants/tapin';

import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Eye,
  FileText,
  HelpCircle,
  Landmark,
  Search,
  Send,
  ZoomIn,
} from 'lucide-react';

function isDprRepresentative(rep: { role?: 'dprd' | 'dpr'; dapilId: string }): boolean {
  return rep.role === 'dpr' || rep.dapilId === 'DAPIL-KALSEL-1';
}

function formatCompactDapilLabel(dapilName: string): string {
  if (dapilName.toLowerCase().includes('kalimantan selatan')) {
    return 'DPR RI Kalsel I';
  }
  return dapilName.replace('Dapil Tapin ', 'Dapil ');
}

function formatRepDistrictsSummary(rep: { dapilId: string; districts: string[] }): string {
  if (rep.dapilId === 'DAPIL-KALSEL-1' || rep.districts.length >= KECAMATAN_TAPIN_LIST.length) {
    return 'Seluruh Kabupaten Tapin (12 Kecamatan)';
  }
  return rep.districts.join(', ');
}

interface ProposalStepProps {
  data: UsulanFormData;
  onChange: (updates: Partial<UsulanFormData>) => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  representatives?: AnggotaDprdTapin[];
  dapils?: DapilTapin[];
}

export function ProposalStep({
  data,
  onChange,
  onBack,
  onSubmit,
  isSubmitting,
  representatives = [],
  dapils = ALL_DAPIL_LIST,
}: ProposalStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Representative Selection State
  const [isRepSelectorOpen, setIsRepSelectorOpen] = useState(false);
  const [repFilterDapil, setRepFilterDapil] = useState<string>('all');
  const [repSearchQuery, setRepSearchQuery] = useState('');
  const [previewRep, setPreviewRep] = useState<AnggotaDprdTapin | null>(null);

  // Available subdistricts based on selected Dapil, or all subdistricts
  const activeDapil = dapils.find((d) => d.id === data.dapilId);
  const availableDistricts = activeDapil ? activeDapil.districts : KECAMATAN_TAPIN_LIST;

  // Filtered representatives
  const filteredRepresentatives = representatives.filter((rep) => {
    const matchesDapil = repFilterDapil === 'all' || rep.dapilId === repFilterDapil;
    const matchesSearch =
      rep.name.toLowerCase().includes(repSearchQuery.toLowerCase()) ||
      rep.party.toLowerCase().includes(repSearchQuery.toLowerCase()) ||
      rep.commission.toLowerCase().includes(repSearchQuery.toLowerCase()) ||
      Boolean(
        rep.districts &&
        rep.districts.some((d) => d.toLowerCase().includes(repSearchQuery.toLowerCase()))
      );
    return matchesDapil && matchesSearch;
  });

  const selectedRepresentative = representatives.find((rep) => rep.id === data.representativeId);

  const handleSelectRepresentative = (rep: AnggotaDprdTapin) => {
    // Keep selected kecamatan only if it belongs to the chosen representative's Dapil
    const keepsKecamatan = Boolean(data.kecamatan && rep.districts.includes(data.kecamatan));
    const newKecamatan = keepsKecamatan ? data.kecamatan : '';
    const newKelurahan = keepsKecamatan ? data.kelurahan : '';

    onChange({
      representativeId: rep.id,
      representativeName: rep.name,
      representativeParty: rep.party,
      dapilId: rep.dapilId,
      dapilName: rep.dapilName,
      kecamatan: newKecamatan,
      kelurahan: newKelurahan,
    });

    setIsRepSelectorOpen(false);
    if (errors.dapil) setErrors((prev) => ({ ...prev, dapil: '' }));
  };

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
    const result = aspirationStepSchema.safeParse(data);

    if (!result.success) {
      setErrors(flattenZodFieldErrors(result));
      window.scrollTo({ top: 150, behavior: 'smooth' });
      return;
    }

    setErrors({});
    onSubmit(e);
  };

  const tooltipDapilId = useId();
  const tooltipKamusId = useId();
  const tooltipMasalahId = useId();
  const tooltipPetaId = useId();
  const tooltipAlamatId = useId();
  const tooltipDokumenId = useId();

  return (
    <TooltipProvider delayDuration={150}>
      <Card className="soft-card border-warm-200 overflow-hidden rounded-3xl shadow-xl">
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleValidateSubmit} noValidate className="space-y-7">
            {/* FIELD 1: TUJUAN DAPIL (LIST NAMA & FOTO ANGGOTA DEWAN) */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <label className="text-darknavy-900 text-xs font-bold sm:text-sm">
                  Tujuan Aspirasi (Dapil &amp; Anggota Dewan){' '}
                  <span className="text-rose-500">*</span>
                </label>
                {/* Shadcn UI Tooltip */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      id={tooltipDapilId}
                      aria-label="Petunjuk pemilihan Dapil"
                      className="hover:bg-warm-100 hover:text-accent-500 focus:ring-accent-500/40 rounded-full p-0.5 text-slate-400 transition-colors focus:ring-2 focus:outline-none"
                    >
                      <HelpCircle className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="start">
                    <div className="flex items-center gap-2">
                      <span className="bg-accent-500 h-2 w-2 shrink-0 rounded-full" />
                      <p className="text-sm font-bold text-white">
                        Pilih Dapil &amp; Anggota Dewan
                      </p>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-300 sm:text-sm">
                      Pilih Daerah Pemilihan (Dapil) dan nama perwakilan DPRD Kab. Tapin atau DPR RI
                      Dapil Kalimantan Selatan I untuk wilayah usulan Anda.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Selected Representative Display or Selection Trigger */}
              <div className="border-warm-200 bg-warm-50/60 space-y-3 rounded-2xl border p-4">
                {selectedRepresentative ? (
                  <div className="flex flex-col justify-between gap-4 rounded-2xl border-2 border-emerald-400 bg-linear-to-r from-emerald-50/70 via-white to-white p-4 shadow-xs sm:flex-row sm:items-center sm:p-5">
                    <div className="flex items-center gap-4 sm:gap-5">
                      {/* Large Portrait Photo Frame */}
                      <button
                        type="button"
                        onClick={() => setPreviewRep(selectedRepresentative)}
                        title="Klik untuk perbesar foto profil anggota dewan"
                        aria-label={`Perbesar foto ${selectedRepresentative.name}`}
                        className="group relative flex h-24 w-20 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-emerald-500 bg-slate-100 shadow-md transition-all hover:ring-4 hover:ring-emerald-400/30 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none sm:h-28 sm:w-24"
                      >
                        {selectedRepresentative.photoUrl ? (
                          <img
                            src={selectedRepresentative.photoUrl}
                            alt={selectedRepresentative.name}
                            className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-emerald-100 text-base font-extrabold text-emerald-800 sm:text-lg">
                            {getInitials(selectedRepresentative.name)}
                          </div>
                        )}
                        <div className="from-darknavy-900/90 via-darknavy-900/50 absolute inset-x-0 bottom-0 bg-linear-to-t to-transparent py-1 text-center">
                          <span className="text-2xs font-extrabold tracking-wider text-emerald-300 uppercase">
                            {isDprRepresentative(selectedRepresentative) ? 'DPR RI' : 'DPRD Tapin'}
                          </span>
                        </div>
                        <div className="bg-darknavy-900/40 absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                          <ZoomIn
                            className="h-6 w-6 text-white drop-shadow-md"
                            aria-hidden="true"
                          />
                        </div>
                      </button>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-darknavy-900 text-sm font-extrabold sm:text-base">
                            {selectedRepresentative.name}
                          </span>
                          <span className="text-2xs rounded-full border border-emerald-300 bg-emerald-100 px-2.5 py-0.5 font-extrabold text-emerald-800">
                            {selectedRepresentative.party}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-emerald-700 sm:text-sm">
                          {selectedRepresentative.dapilName} (
                          {formatRepDistrictsSummary(selectedRepresentative)})
                        </p>
                        <p className="text-2xs text-slate-500 sm:text-xs">
                          {selectedRepresentative.commission}
                        </p>
                        <button
                          type="button"
                          onClick={() => setPreviewRep(selectedRepresentative)}
                          className="text-2xs flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
                        >
                          <Eye className="h-3 w-3" />
                          <span>Lihat Foto Penuh</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-2 sm:flex-col">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setIsRepSelectorOpen((prev) => !prev)}
                        className="text-darknavy-900 shrink-0 rounded-full border-emerald-300 text-xs font-bold hover:border-emerald-400 hover:bg-emerald-50"
                      >
                        <span>Ganti Anggota Dewan</span>
                        <ChevronDown className="ml-1 h-3.5 w-3.5 text-emerald-600" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border-warm-300 flex flex-col items-center justify-between gap-3 rounded-xl border border-dashed bg-white p-4 sm:flex-row">
                    <div className="flex items-center gap-3 text-left">
                      <div className="bg-warm-100 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-slate-400">
                        <Landmark className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-darknavy-900 text-xs font-bold sm:text-sm">
                          Belum ada anggota dewan / Dapil yang dipilih
                        </p>
                        <p className="text-2xs text-slate-500 sm:text-xs">
                          Pilih perwakilan DPRD Kab. Tapin atau DPR RI Dapil Kalimantan Selatan I
                        </p>
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={() => setIsRepSelectorOpen(true)}
                      className="shrink-0 rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
                    >
                      <span>Buka Daftar Nama &amp; Foto Dapil</span>
                    </Button>
                  </div>
                )}

                {/* Collapsible Selector Card Grid */}
                {isRepSelectorOpen ? (
                  <div className="border-warm-200 animate-in fade-in space-y-3.5 rounded-2xl border bg-white p-4 shadow-md duration-150">
                    <div className="border-warm-200 flex flex-col justify-between gap-2.5 border-b pb-3 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-2">
                        <Landmark className="h-4 w-4 text-emerald-600" />
                        <span className="text-darknavy-900 text-xs font-extrabold sm:text-sm">
                          Daftar Nama &amp; Foto Anggota Dewan (Periode 2024–2029)
                        </span>
                      </div>

                      {/* Dapil Tabs */}
                      <div className="border-warm-200 bg-warm-50 text-2xs inline-flex flex-wrap rounded-lg border p-0.5">
                        <button
                          type="button"
                          onClick={() => setRepFilterDapil('all')}
                          className={`rounded-md px-2.5 py-1 font-bold transition-all ${
                            repFilterDapil === 'all'
                              ? 'bg-darknavy-900 text-white'
                              : 'hover:text-darknavy-900 text-slate-600'
                          }`}
                        >
                          Semua ({representatives.length})
                        </button>
                        {dapils.map((dapil) => {
                          const count = representatives.filter(
                            (r) => r.dapilId === dapil.id
                          ).length;
                          const isSelected = repFilterDapil === dapil.id;
                          return (
                            <button
                              key={dapil.id}
                              type="button"
                              onClick={() => setRepFilterDapil(dapil.id)}
                              className={`rounded-md px-2.5 py-1 font-bold transition-all ${
                                isSelected
                                  ? 'bg-emerald-600 text-white'
                                  : 'hover:text-darknavy-900 text-slate-600'
                              }`}
                            >
                              {formatCompactDapilLabel(dapil.name)} ({count})
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                      <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                      <Input
                        type="text"
                        value={repSearchQuery}
                        onChange={(e) => setRepSearchQuery(e.target.value)}
                        placeholder="Cari nama dewan, partai, atau kecamatan..."
                        className="border-warm-200 bg-warm-50 h-9 pl-8 text-xs"
                      />
                    </div>

                    {/* Representatives Grid */}
                    <div className="grid max-h-115 grid-cols-1 gap-3 overflow-y-auto pr-1 md:grid-cols-2">
                      {filteredRepresentatives.map((rep) => {
                        const isSelected = data.representativeId === rep.id;
                        return (
                          <div
                            key={rep.id}
                            className={`group relative rounded-2xl border p-3 transition-all ${
                              isSelected
                                ? 'border-emerald-500 bg-emerald-50/90 shadow-md ring-2 ring-emerald-500/30'
                                : 'border-warm-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/30 hover:shadow-xs'
                            }`}
                          >
                            <button
                              type="button"
                              aria-label={`Pilih ${rep.name} (${rep.dapilName})`}
                              aria-pressed={isSelected}
                              onClick={() => handleSelectRepresentative(rep)}
                              className="focus-visible:ring-accent-500 absolute inset-0 z-0 cursor-pointer rounded-2xl focus-visible:ring-2 focus-visible:outline-none"
                            />

                            <div className="pointer-events-none relative z-10 flex items-center justify-between gap-3.5 text-left">
                              <div className="flex min-w-0 items-center gap-3">
                                {/* Large Portrait Photo Frame */}
                                <button
                                  type="button"
                                  onClick={() => setPreviewRep(rep)}
                                  title="Klik untuk perbesar foto profil anggota dewan"
                                  aria-label={`Perbesar foto ${rep.name}`}
                                  className="border-warm-300 pointer-events-auto relative h-22 w-18 shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 bg-slate-100 shadow-xs transition-colors group-hover:border-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none sm:h-24 sm:w-20"
                                >
                                  {rep.photoUrl ? (
                                    <img
                                      src={rep.photoUrl}
                                      alt={rep.name}
                                      className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                                      loading="lazy"
                                    />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-emerald-100 text-sm font-extrabold text-emerald-800 sm:text-base">
                                      {getInitials(rep.name)}
                                    </div>
                                  )}
                                  <div className="from-darknavy-900/90 via-darknavy-900/40 absolute inset-x-0 bottom-0 bg-linear-to-t to-transparent py-0.5 text-center">
                                    <span className="text-2xs leading-tight font-extrabold tracking-tight text-emerald-300 uppercase">
                                      {formatCompactDapilLabel(rep.dapilName)}
                                    </span>
                                  </div>
                                  <div className="bg-darknavy-900/30 absolute inset-0 flex items-center justify-center opacity-0 transition-opacity hover:opacity-100">
                                    <ZoomIn
                                      className="h-5 w-5 text-white drop-shadow-sm"
                                      aria-hidden="true"
                                    />
                                  </div>
                                </button>

                                <div className="min-w-0">
                                  <span className="text-darknavy-900 block truncate text-xs font-extrabold sm:text-sm">
                                    {rep.name}
                                  </span>
                                  <span className="bg-warm-100 border-warm-200 text-xs-tight mt-0.5 inline-block rounded border px-2 py-0.5 font-bold text-slate-700">
                                    {rep.party}
                                  </span>
                                  <p className="text-2xs mt-1 truncate font-semibold text-emerald-800">
                                    {formatRepDistrictsSummary(rep)}
                                  </p>
                                  <p className="text-2xs truncate text-slate-500">
                                    {rep.commission}
                                  </p>
                                  <button
                                    type="button"
                                    onClick={() => setPreviewRep(rep)}
                                    className="text-2xs pointer-events-auto mt-1 flex cursor-pointer items-center gap-1 font-bold text-emerald-700 hover:underline focus-visible:underline focus-visible:outline-none"
                                  >
                                    <Eye className="h-2.5 w-2.5" aria-hidden="true" />
                                    <span>Perbesar Wajah</span>
                                  </button>
                                </div>
                              </div>

                              <div className="shrink-0">
                                {isSelected ? (
                                  <span className="text-2xs flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-1 font-extrabold text-white shadow-xs">
                                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                                    <span>Terpilih</span>
                                  </span>
                                ) : (
                                  <span className="text-2xs border-warm-300 inline-flex h-8 items-center rounded-full border bg-white px-3 font-bold text-slate-600 transition-colors group-hover:border-emerald-500 group-hover:bg-emerald-600 group-hover:text-white">
                                    Pilih
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>

              {errors.dapil ? (
                <p id="dapil-error" className="text-2xs font-semibold text-rose-500">
                  {errors.dapil}
                </p>
              ) : null}
            </div>

            {/* FIELD 2: KAMUS USULAN */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <label
                  htmlFor="kamus-usulan-select"
                  className="text-darknavy-900 text-xs font-bold sm:text-sm"
                >
                  Kamus Usulan <span className="text-rose-500">*</span>
                </label>
                {/* Shadcn UI Tooltip */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      id={tooltipKamusId}
                      aria-label="Petunjuk Kamus Usulan"
                      className="hover:bg-warm-100 hover:text-accent-500 focus:ring-accent-500/40 rounded-full p-0.5 text-slate-400 transition-colors focus:ring-2 focus:outline-none"
                    >
                      <HelpCircle className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="start">
                    <div className="flex items-center gap-2">
                      <span className="bg-accent-500 h-2 w-2 shrink-0 rounded-full" />
                      <p className="text-sm font-bold text-white">Pilih Kamus Usulan</p>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-300 sm:text-sm">
                      Pilih program/kegiatan yang sesuai dengan usulan pembangunan atau bantuan yang
                      Anda ajukan.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <Select
                value={data.kamusUsulan}
                onValueChange={(val) => {
                  onChange({ kamusUsulan: val });
                  if (errors.kamusUsulan) setErrors((prev) => ({ ...prev, kamusUsulan: '' }));
                }}
              >
                <SelectTrigger
                  id="kamus-usulan-select"
                  aria-invalid={Boolean(errors.kamusUsulan)}
                  aria-describedby={errors.kamusUsulan ? 'kamus-usulan-error' : undefined}
                  className={`border-warm-200 bg-white ${
                    errors.kamusUsulan ? 'border-rose-500 focus-visible:ring-rose-500' : ''
                  }`}
                >
                  <SelectValue placeholder="Pilih Kamus Usulan yang sesuai" />
                </SelectTrigger>
                <SelectContent>
                  {KAMUS_USULAN_LIST.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.kamusUsulan ? (
                <p id="kamus-usulan-error" className="text-2xs font-semibold text-rose-500">
                  {errors.kamusUsulan}
                </p>
              ) : null}
            </div>

            {/* FIELD 3: PERMASALAHAN */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <label
                  htmlFor="permasalahan-input"
                  className="text-darknavy-900 text-xs font-bold sm:text-sm"
                >
                  Permasalahan & Estimasi Anggaran <span className="text-rose-500">*</span>
                </label>
                {/* Shadcn UI Tooltip */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      id={tooltipMasalahId}
                      aria-label="Petunjuk Rincian Permasalahan"
                      className="hover:bg-warm-100 hover:text-accent-500 focus:ring-accent-500/40 rounded-full p-0.5 text-slate-400 transition-colors focus:ring-2 focus:outline-none"
                    >
                      <HelpCircle className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="start">
                    <div className="flex items-center gap-2">
                      <span className="bg-accent-500 h-2 w-2 shrink-0 rounded-full" />
                      <p className="text-sm font-bold text-white">Rincian & Estimasi Anggaran</p>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-300 sm:text-sm">
                      Tuliskan dengan spesifik, singkat, dan jelas usulan beserta estimasi kebutuhan
                      anggaran.
                    </p>
                    <div className="border-darknavy-800 bg-darknavy-950/70 mt-2.5 rounded-xl border p-2.5 text-xs text-slate-300">
                      <strong className="text-accent-500">Contoh:</strong> Perbaikan rumah tidak
                      layak huni milik Bapak Budi 1 Unit Rp 15.000.000
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>

              <Textarea
                id="permasalahan-input"
                required
                aria-invalid={Boolean(errors.permasalahan)}
                aria-describedby={errors.permasalahan ? 'permasalahan-error' : undefined}
                rows={4}
                value={data.permasalahan}
                onChange={(e) => {
                  onChange({ permasalahan: e.target.value });
                  if (errors.permasalahan) setErrors((prev) => ({ ...prev, permasalahan: '' }));
                }}
                placeholder="Contoh: Perbaikan rumah tidak layak huni milik Bapak Budi 1 Unit RP 15.000.000"
                className={`border-warm-200 bg-white ${
                  errors.permasalahan ? 'border-rose-500 focus-visible:ring-rose-500' : ''
                }`}
              />
              <div className="text-2xs flex items-center justify-between text-slate-400">
                <span>Rincikan nama penerima usulan, volume fisik, dan perkiraan biaya.</span>
                <span>{data.permasalahan.length} karakter</span>
              </div>
              {errors.permasalahan ? (
                <p id="permasalahan-error" className="text-2xs font-semibold text-rose-500">
                  {errors.permasalahan}
                </p>
              ) : null}
            </div>

            {/* FIELD 4: PETA LOKASI */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <label className="text-darknavy-900 text-xs font-bold sm:text-sm">
                  Peta Lokasi <span className="text-rose-500">*</span>
                </label>
                {/* Shadcn UI Tooltip */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      id={tooltipPetaId}
                      aria-label="Petunjuk Peta Lokasi"
                      className="hover:bg-warm-100 hover:text-accent-500 focus:ring-accent-500/40 rounded-full p-0.5 text-slate-400 transition-colors focus:ring-2 focus:outline-none"
                    >
                      <HelpCircle className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="start">
                    <div className="flex items-center gap-2">
                      <span className="bg-accent-500 h-2 w-2 shrink-0 rounded-full" />
                      <p className="text-sm font-bold text-white">Peta Lokasi Usulan</p>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-300 sm:text-sm">
                      Pilih dan letakkan tanda pin ke titik lokasi fisik rencana usulan.
                    </p>
                    <div className="border-darknavy-800 bg-darknavy-950/70 mt-2.5 rounded-xl border p-2.5 text-xs text-slate-300">
                      Pin lokasi membantu tim perwakilan dewan saat survei lapangan ke Kabupaten
                      Tapin.
                    </div>
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

            {/* FIELD 5: ALAMAT LOKASI */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <label
                  htmlFor="alamat-lokasi-input"
                  className="text-darknavy-900 text-xs font-bold sm:text-sm"
                >
                  Alamat Lokasi <span className="text-rose-500">*</span>
                </label>
                {/* Shadcn UI Tooltip */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      id={tooltipAlamatId}
                      aria-label="Petunjuk Alamat Lokasi"
                      className="hover:bg-warm-100 hover:text-accent-500 focus:ring-accent-500/40 rounded-full p-0.5 text-slate-400 transition-colors focus:ring-2 focus:outline-none"
                    >
                      <HelpCircle className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="start">
                    <div className="flex items-center gap-2">
                      <span className="bg-accent-500 h-2 w-2 shrink-0 rounded-full" />
                      <p className="text-sm font-bold text-white">Detail Alamat</p>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-300 sm:text-sm">
                      Tuliskan dengan lengkap dan rinci lokasi/penerima usulan (1 usulan/lokasi).
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <Textarea
                id="alamat-lokasi-input"
                required
                aria-invalid={Boolean(errors.alamatLokasi)}
                aria-describedby={errors.alamatLokasi ? 'alamat-lokasi-error' : undefined}
                rows={2}
                value={data.alamatLokasi}
                onChange={(e) => {
                  onChange({ alamatLokasi: e.target.value });
                  if (errors.alamatLokasi) setErrors((prev) => ({ ...prev, alamatLokasi: '' }));
                }}
                placeholder="Dusun 1, RT 02 / RW 01, Samping Pos Ronda"
                className={`border-warm-200 bg-white ${
                  errors.alamatLokasi ? 'border-rose-500 focus-visible:ring-rose-500' : ''
                }`}
              />
              {errors.alamatLokasi ? (
                <p id="alamat-lokasi-error" className="text-2xs font-semibold text-rose-500">
                  {errors.alamatLokasi}
                </p>
              ) : null}
            </div>

            {/* ADMINISTRATIVE REGION: KABUPATEN, KECAMATAN, KELURAHAN */}
            <RegionSelectorFields
              idPrefix="proposal"
              kabupaten={data.kabupaten}
              kabupatenLabel="Kabupaten atau Kota"
              kecamatan={data.kecamatan}
              kelurahan={data.kelurahan}
              districts={availableDistricts}
              kecamatanError={errors.kecamatan}
              kelurahanError={errors.kelurahan}
              onKecamatanChange={handleKecamatanChange}
              onKelurahanChange={(val) => {
                onChange({ kelurahan: val });
                if (errors.kelurahan) setErrors((prev) => ({ ...prev, kelurahan: '' }));
              }}
            />

            {/* FIELD 6: DOKUMEN PENDUKUNG (SURAT PROPOSAL & FOTO LOKASI 1-3) */}
            <div className="border-warm-200 bg-warm-50/60 space-y-4 rounded-3xl border p-5">
              <div className="border-warm-200 flex items-center justify-between border-b pb-2.5">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-darknavy-900 flex items-center gap-2 text-xs font-extrabold sm:text-sm">
                    <FileText className="text-accent-500 h-4 w-4" />
                    <span>Upload Dokumen Pendukung (Proposal dan Foto)</span>
                  </h3>
                  {/* Shadcn UI Tooltip */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        id={tooltipDokumenId}
                        aria-label="Petunjuk Dokumen Pendukung"
                        className="hover:bg-warm-100 hover:text-accent-500 focus:ring-accent-500/40 rounded-full p-0.5 text-slate-400 transition-colors focus:ring-2 focus:outline-none"
                      >
                        <HelpCircle className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="start">
                      <div className="flex items-center gap-2">
                        <span className="bg-accent-500 h-2 w-2 shrink-0 rounded-full" />
                        <p className="text-sm font-bold text-white">Upload Dokumen Pendukung</p>
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-300 sm:text-sm">
                        Upload dokumen pendukung (proposal PDF dan foto) untuk memperkuat usulan.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <span className="text-xs font-medium text-slate-500">Opsional</span>
              </div>

              {/* Surat Proposal */}
              <SupportingDocumentField
                id="proposal-doc-input"
                label="Surat Proposal"
                placeholder="Proposal.pdf (Belum ada file)"
                fileName={data.proposalFileName}
                error={errors.proposal}
                onFileSelect={(file) => {
                  onChange({ proposalFileName: file.name, proposalFile: file });
                  if (errors.proposal) setErrors((prev) => ({ ...prev, proposal: '' }));
                }}
                onClear={() => onChange({ proposalFileName: '', proposalFile: null })}
                onError={(message) => setErrors((prev) => ({ ...prev, proposal: message }))}
              />

              {/* Foto Lokasi Dokumentasi Dropzone */}
              <PhotoDropzone
                photos={data.photos || []}
                onChange={(photos) => onChange({ photos })}
                error={errors.photos}
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
                  {isSubmitting ? 'Menyimpan & Mengirim Usulan...' : 'Simpan & Kirim Aspirasi'}
                </span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Modal Detail Wajah & Profil Anggota Dewan */}
      {previewRep ? (
        <Dialog open={Boolean(previewRep)} onOpenChange={(open) => !open && setPreviewRep(null)}>
          <DialogContent className="border-warm-200 rounded-3xl bg-white p-6 shadow-2xl sm:max-w-md">
            <DialogHeader className="pb-1 text-center sm:text-center">
              <DialogTitle className="text-darknavy-900 text-lg font-black">
                {isDprRepresentative(previewRep)
                  ? 'Profil Anggota DPR RI'
                  : 'Profil Anggota DPRD Kab. Tapin'}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Foto resmi dan identitas perwakilan daerah pemilihan Anda
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center space-y-4 pt-2 text-center">
              {/* Foto Besar Wajah Dewan */}
              <div className="relative h-64 w-52 overflow-hidden rounded-2xl border-4 border-emerald-400 bg-slate-100 shadow-lg sm:h-72 sm:w-60">
                {previewRep.photoUrl ? (
                  <img
                    src={previewRep.photoUrl}
                    alt={previewRep.name}
                    className="h-full w-full object-cover object-top"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-emerald-100 text-3xl font-black text-emerald-800 sm:text-4xl">
                    {getInitials(previewRep.name)}
                  </div>
                )}
                <div className="from-darknavy-900/90 via-darknavy-900/40 absolute inset-x-0 bottom-0 bg-linear-to-t py-2 text-center">
                  <span className="text-xs font-black tracking-wider text-emerald-300 uppercase">
                    {isDprRepresentative(previewRep)
                      ? 'DPR RI • DAPIL KALSEL I'
                      : 'DPRD KABUPATEN TAPIN'}
                  </span>
                </div>
              </div>

              <div className="w-full space-y-1.5">
                <h3 className="text-darknavy-900 text-lg font-extrabold">{previewRep.name}</h3>
                <div className="flex items-center justify-center gap-2">
                  <span className="rounded-full border border-emerald-300 bg-emerald-100 px-2.5 py-0.5 text-xs font-extrabold text-emerald-800">
                    {previewRep.party}
                  </span>
                  <span className="bg-warm-100 rounded-full px-2.5 py-0.5 text-xs font-bold text-slate-600">
                    {previewRep.dapilName}
                  </span>
                </div>
                <p className="text-xs font-semibold text-emerald-700">
                  Cakupan Wilayah: {formatRepDistrictsSummary(previewRep)}
                </p>
                <p className="text-xs text-slate-500">{previewRep.commission}</p>
              </div>

              <div className="flex w-full gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="border-warm-300 text-darknavy-900 hover:bg-warm-100 flex-1 rounded-xl text-xs font-bold"
                  onClick={() => setPreviewRep(null)}
                >
                  Tutup
                </Button>
                <Button
                  type="button"
                  className="flex-1 rounded-xl bg-emerald-600 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
                  onClick={() => {
                    handleSelectRepresentative(previewRep);
                    setPreviewRep(null);
                  }}
                >
                  Pilih Wakil Ini
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ) : null}
    </TooltipProvider>
  );
}
