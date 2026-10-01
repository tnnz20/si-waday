import { useId, useRef, useState } from 'react';

import { MapPicker } from '@/components/aspiration/map-picker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  ANGGOTA_DPRD_TAPIN,
  type AnggotaDprdTapin,
  DAPIL_TAPIN_LIST,
  DESA_KELURAHAN_TAPIN_MAP,
  KAMUS_USULAN_LIST,
  KECAMATAN_TAPIN_LIST,
} from '@/constants/tapin';

import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Eye,
  FileText,
  FileUp,
  HelpCircle,
  Image as ImageIcon,
  Landmark,
  Search,
  Send,
  Trash2,
  ZoomIn,
} from 'lucide-react';

interface ProposalStepProps {
  data: UsulanFormData;
  onChange: (updates: Partial<UsulanFormData>) => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export function ProposalStep({
  data,
  onChange,
  onBack,
  onSubmit,
  isSubmitting,
}: ProposalStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Representative Selection State
  const [isRepSelectorOpen, setIsRepSelectorOpen] = useState(false);
  const [repFilterDapil, setRepFilterDapil] = useState<string>('all');
  const [repSearchQuery, setRepSearchQuery] = useState('');
  const [previewRep, setPreviewRep] = useState<AnggotaDprdTapin | null>(null);

  const proposalInputRef = useRef<HTMLInputElement | null>(null);
  const photo1InputRef = useRef<HTMLInputElement | null>(null);
  const photo2InputRef = useRef<HTMLInputElement | null>(null);
  const photo3InputRef = useRef<HTMLInputElement | null>(null);

  // Available subdistricts based on selected Dapil, or all subdistricts
  const activeDapil = DAPIL_TAPIN_LIST.find((d) => d.id === data.dapilId);
  const availableDistricts = activeDapil ? activeDapil.districts : KECAMATAN_TAPIN_LIST;

  // Available villages based on selected subdistrict
  const availableVillages = data.kecamatan ? DESA_KELURAHAN_TAPIN_MAP[data.kecamatan] || [] : [];

  // Filtered representatives
  const filteredRepresentatives = ANGGOTA_DPRD_TAPIN.filter((rep) => {
    const matchesDapil = repFilterDapil === 'all' || rep.dapilId === repFilterDapil;
    const matchesSearch =
      rep.name.toLowerCase().includes(repSearchQuery.toLowerCase()) ||
      rep.party.toLowerCase().includes(repSearchQuery.toLowerCase()) ||
      rep.commission.toLowerCase().includes(repSearchQuery.toLowerCase()) ||
      rep.districts.some((d) => d.toLowerCase().includes(repSearchQuery.toLowerCase()));
    return matchesDapil && matchesSearch;
  });

  const selectedRepresentative = ANGGOTA_DPRD_TAPIN.find((rep) => rep.id === data.representativeId);

  const handleSelectRepresentative = (rep: AnggotaDprdTapin) => {
    // If current kecamatan is not in the new dapil, pick the first one
    const newKecamatan = rep.districts.includes(data.kecamatan)
      ? data.kecamatan
      : rep.districts[0] || 'Tapin Utara';

    const newVillages = DESA_KELURAHAN_TAPIN_MAP[newKecamatan] || [];
    const newKelurahan = newVillages[0] || '';

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
    const villages = DESA_KELURAHAN_TAPIN_MAP[kecamatan] || [];
    onChange({
      kecamatan,
      kelurahan: villages[0] || '',
    });
    if (errors.kecamatan) setErrors((prev) => ({ ...prev, kecamatan: '' }));
  };

  // Proposal File upload handler
  const handleProposalUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, proposal: 'Ukuran proposal maksimal 10MB.' }));
      return;
    }
    onChange({ proposalFileName: file.name });
    if (errors.proposal) setErrors((prev) => ({ ...prev, proposal: '' }));
  };

  // Photo uploads handler
  const handlePhotoUpload = (index: 1 | 2 | 3, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, [`photo${index}`]: 'Ukuran foto maksimal 8MB.' }));
      return;
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

  const handleValidateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!data.dapilId || !data.representativeName) {
      newErrors.dapil = 'Silakan pilih anggota dewan / perwakilan Dapil tujuan usulan.';
    }
    if (!data.kamusUsulan) {
      newErrors.kamusUsulan = 'Kamus usulan wajib dipilih.';
    }
    if (!data.permasalahan.trim()) {
      newErrors.permasalahan = 'Deskripsi permasalahan dan rincian usulan wajib diisi.';
    }
    if (!data.alamatLokasi.trim()) {
      newErrors.alamatLokasi = 'Alamat lokasi usulan wajib diisi secara rinci.';
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

  const tooltipDapilId = useId();
  const tooltipKamusId = useId();
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
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg">
                <FileUp className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xs rounded-full border border-emerald-500/40 bg-emerald-500/20 px-2.5 py-0.5 font-extrabold tracking-wider text-emerald-400 uppercase">
                    Langkah 2 dari 2
                  </span>
                  <span className="text-xs text-slate-400">Pokir DPRD Kab. Tapin</span>
                </div>
                <CardTitle className="mt-1 text-xl font-extrabold text-white sm:text-2xl">
                  FORM USULAN ASPIRASI DAPIL
                </CardTitle>
                <CardDescription className="text-xs text-slate-300">
                  Penyampaian usulan resmi langsung ke perwakilan anggota DPRD Kabupaten Tapin
                </CardDescription>
              </div>
            </div>

            <div className="border-darknavy-800 bg-darknavy-800/80 text-2xs flex items-center gap-2 rounded-2xl border px-3.5 py-2 text-slate-300">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
              <span>25 Anggota Dewan Siap Menampung</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleValidateSubmit} className="space-y-7">
            {/* FIELD 1: TUJUAN DAPIL (LIST NAMA & FOTO DUMMY ANGGOTA DPRD) */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <label className="text-darknavy-900 text-xs font-bold sm:text-sm">
                  Tujuan Aspirasi (Dapil & Anggota DPRD) <span className="text-rose-500">*</span>
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
                      <p className="text-sm font-bold text-white">Pilih Dapil & Anggota DPRD</p>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-300 sm:text-sm">
                      Pilih Daerah Pemilihan (Dapil) dan nama anggota dewan yang mewakili wilayah
                      usulan Anda di Kabupaten Tapin.
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
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => setPreviewRep(selectedRepresentative)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setPreviewRep(selectedRepresentative);
                          }
                        }}
                        title="Klik untuk perbesar foto profil anggota dewan"
                        className="group relative flex h-24 w-20 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-emerald-500 bg-slate-100 shadow-md transition-all hover:ring-4 hover:ring-emerald-400/30 sm:h-28 sm:w-24"
                      >
                        <img
                          src={selectedRepresentative.photoUrl}
                          alt={selectedRepresentative.name}
                          className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="from-darknavy-900/90 via-darknavy-900/50 absolute inset-x-0 bottom-0 bg-linear-to-t to-transparent py-1 text-center">
                          <span className="text-[10px] font-extrabold tracking-wider text-emerald-300 uppercase">
                            DPRD Tapin
                          </span>
                        </div>
                        <div className="bg-darknavy-900/40 absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                          <ZoomIn className="h-6 w-6 text-white drop-shadow-md" />
                        </div>
                      </div>

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
                          {selectedRepresentative.districts.join(', ')})
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
                          Pilih nama perwakilan anggota dewan dari 25 wakil rakyat DPRD Kab. Tapin
                        </p>
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={() => setIsRepSelectorOpen(true)}
                      className="shrink-0 rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
                    >
                      <span>Buka Daftar Nama & Foto Dapil</span>
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
                          Daftar Nama & Foto Anggota DPRD Kab. Tapin (Periode 2024–2029)
                        </span>
                      </div>

                      {/* Dapil Tabs */}
                      <div className="border-warm-200 bg-warm-50 text-2xs inline-flex rounded-lg border p-0.5">
                        <button
                          type="button"
                          onClick={() => setRepFilterDapil('all')}
                          className={`rounded-md px-2.5 py-1 font-bold transition-all ${
                            repFilterDapil === 'all'
                              ? 'bg-darknavy-900 text-white'
                              : 'hover:text-darknavy-900 text-slate-600'
                          }`}
                        >
                          Semua (25)
                        </button>
                        <button
                          type="button"
                          onClick={() => setRepFilterDapil('dapil-1')}
                          className={`rounded-md px-2.5 py-1 font-bold transition-all ${
                            repFilterDapil === 'dapil-1'
                              ? 'bg-emerald-600 text-white'
                              : 'hover:text-darknavy-900 text-slate-600'
                          }`}
                        >
                          Dapil 1 (7)
                        </button>
                        <button
                          type="button"
                          onClick={() => setRepFilterDapil('dapil-2')}
                          className={`rounded-md px-2.5 py-1 font-bold transition-all ${
                            repFilterDapil === 'dapil-2'
                              ? 'bg-emerald-600 text-white'
                              : 'hover:text-darknavy-900 text-slate-600'
                          }`}
                        >
                          Dapil 2 (10)
                        </button>
                        <button
                          type="button"
                          onClick={() => setRepFilterDapil('dapil-3')}
                          className={`rounded-md px-2.5 py-1 font-bold transition-all ${
                            repFilterDapil === 'dapil-3'
                              ? 'bg-emerald-600 text-white'
                              : 'hover:text-darknavy-900 text-slate-600'
                          }`}
                        >
                          Dapil 3 (8)
                        </button>
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
                    <div className="grid max-h-[460px] grid-cols-1 gap-3 overflow-y-auto pr-1 md:grid-cols-2">
                      {filteredRepresentatives.map((rep) => {
                        const isSelected = data.representativeId === rep.id;
                        return (
                          <div
                            key={rep.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => handleSelectRepresentative(rep)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                handleSelectRepresentative(rep);
                              }
                            }}
                            className={`group relative flex cursor-pointer items-center justify-between gap-3.5 rounded-2xl border p-3 text-left transition-all ${
                              isSelected
                                ? 'border-emerald-500 bg-emerald-50/90 shadow-md ring-2 ring-emerald-500/30'
                                : 'border-warm-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/30 hover:shadow-xs'
                            }`}
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              {/* Large Portrait Photo Frame */}
                              <div
                                role="button"
                                tabIndex={0}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPreviewRep(rep);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.stopPropagation();
                                    setPreviewRep(rep);
                                  }
                                }}
                                title="Klik untuk perbesar foto profil anggota dewan"
                                className="border-warm-300 relative h-22 w-18 shrink-0 overflow-hidden rounded-xl border-2 bg-slate-100 shadow-xs transition-colors group-hover:border-emerald-400 sm:h-24 sm:w-20"
                              >
                                <img
                                  src={rep.photoUrl}
                                  alt={rep.name}
                                  className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                                  loading="lazy"
                                />
                                <div className="from-darknavy-900/90 via-darknavy-900/40 absolute inset-x-0 bottom-0 bg-linear-to-t to-transparent py-0.5 text-center">
                                  <span className="text-[8px] font-extrabold tracking-tight text-emerald-300 uppercase sm:text-[9px]">
                                    {rep.dapilName.replace('Dapil Tapin ', 'Dapil ')}
                                  </span>
                                </div>
                                <div className="bg-darknavy-900/30 absolute inset-0 flex items-center justify-center opacity-0 transition-opacity hover:opacity-100">
                                  <ZoomIn className="h-5 w-5 text-white drop-shadow-sm" />
                                </div>
                              </div>

                              <div className="min-w-0">
                                <span className="text-darknavy-900 block truncate text-xs font-extrabold sm:text-sm">
                                  {rep.name}
                                </span>
                                <span className="bg-warm-100 border-warm-200 mt-0.5 inline-block rounded border px-2 py-0.5 text-[11px] font-bold text-slate-700">
                                  {rep.party}
                                </span>
                                <p className="text-2xs mt-1 truncate font-semibold text-emerald-800">
                                  {rep.districts.join(', ')}
                                </p>
                                <p className="text-3xs truncate text-slate-500">{rep.commission}</p>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPreviewRep(rep);
                                  }}
                                  className="text-3xs mt-1 flex items-center gap-1 font-bold text-emerald-700 hover:underline"
                                >
                                  <Eye className="h-2.5 w-2.5" />
                                  <span>Perbesar Wajah</span>
                                </button>
                              </div>
                            </div>

                            <div className="shrink-0">
                              {isSelected ? (
                                <span className="text-2xs flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-1 font-extrabold text-white shadow-xs">
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  <span>Terpilih</span>
                                </span>
                              ) : (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="text-2xs border-warm-300 h-8 rounded-full px-3 font-bold text-slate-600 transition-colors group-hover:border-emerald-500 group-hover:bg-emerald-600 group-hover:text-white"
                                >
                                  Pilih
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>

              {errors.dapil ? (
                <p className="text-2xs font-semibold text-rose-500">{errors.dapil}</p>
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
                  className={`border-warm-200 bg-white ${
                    errors.kamusUsulan ? 'border-rose-400 focus:ring-rose-400' : ''
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
                <p className="text-2xs font-semibold text-rose-500">{errors.kamusUsulan}</p>
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
                rows={4}
                value={data.permasalahan}
                onChange={(e) => {
                  onChange({ permasalahan: e.target.value });
                  if (errors.permasalahan) setErrors((prev) => ({ ...prev, permasalahan: '' }));
                }}
                placeholder="Contoh: Perbaikan rumah tidak layak huni milik Bapak Budi 1 Unit RP 15.000.000"
                className={`border-warm-200 bg-white ${
                  errors.permasalahan ? 'border-rose-400 focus:ring-rose-400' : ''
                }`}
              />
              <div className="text-2xs flex items-center justify-between text-slate-400">
                <span>Rincikan nama penerima usulan, volume fisik, dan perkiraan biaya.</span>
                <span>{data.permasalahan.length} karakter</span>
              </div>
              {errors.permasalahan ? (
                <p className="text-2xs font-semibold text-rose-500">{errors.permasalahan}</p>
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
                      Pin lokasi membantu tim komisi DPRD saat survei lapangan ke Kabupaten Tapin.
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
                rows={2}
                value={data.alamatLokasi}
                onChange={(e) => {
                  onChange({ alamatLokasi: e.target.value });
                  if (errors.alamatLokasi) setErrors((prev) => ({ ...prev, alamatLokasi: '' }));
                }}
                placeholder="Dusun 1, RT 02 / RW 01, Samping Pos Ronda"
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
                    htmlFor="kabupaten-select"
                    className="text-darknavy-900 mb-1.5 block text-xs font-bold"
                  >
                    Kabupaten atau Kota <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    id="kabupaten-select"
                    type="text"
                    readOnly
                    value={data.kabupaten}
                    className="border-warm-200 bg-warm-100 text-darknavy-900 cursor-not-allowed text-xs font-semibold"
                  />
                </div>

                {/* Kecamatan */}
                <div>
                  <label
                    htmlFor="kecamatan-select"
                    className="text-darknavy-900 mb-1.5 block text-xs font-bold"
                  >
                    Kecamatan <span className="text-rose-500">*</span>
                  </label>
                  <Select value={data.kecamatan} onValueChange={handleKecamatanChange}>
                    <SelectTrigger
                      id="kecamatan-select"
                      className={`border-warm-200 bg-white text-xs ${
                        errors.kecamatan ? 'border-rose-400 focus:ring-rose-400' : ''
                      }`}
                    >
                      <SelectValue placeholder="Pilih Kecamatan" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDistricts.map((kec) => (
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
                    htmlFor="kelurahan-select"
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
                      id="kelurahan-select"
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

              {/* Hidden file inputs */}
              <input
                type="file"
                ref={proposalInputRef}
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleProposalUpload}
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

              {/* Surat Proposal */}
              <div className="space-y-1">
                <label className="text-darknavy-900 block text-xs font-bold">
                  Surat Proposal <span className="font-normal text-slate-400">(opsional)</span>
                </label>
                <div className="border-warm-300 flex items-center justify-between rounded-xl border bg-white p-2 shadow-2xs">
                  <div className="flex min-w-0 items-center gap-2 pr-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => proposalInputRef.current?.click()}
                      className="border-warm-300 bg-warm-100 hover:bg-warm-200 text-darknavy-900 shrink-0 rounded-lg text-xs"
                    >
                      Browse...
                    </Button>
                    <span className="truncate font-mono text-xs text-slate-700">
                      {data.proposalFileName || 'Proposal.pdf (Belum ada file)'}
                    </span>
                  </div>

                  {data.proposalFileName ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onChange({ proposalFileName: '' })}
                      className="h-8 w-8 p-0 text-rose-500 hover:bg-rose-50 hover:text-rose-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  ) : null}
                </div>
              </div>

              {/* Foto Lokasi 1-3 Grid */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {/* Foto 1 */}
                <div className="space-y-1">
                  <label className="text-darknavy-900 text-2xs block font-bold">
                    Foto Lokasi 1 (opsional)
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
                          alt="Foto 1"
                          className="border-warm-200 h-6 w-6 shrink-0 rounded border object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-4 w-4 shrink-0 text-slate-400" />
                      )}
                      <span className="text-3xs truncate font-mono text-slate-700">
                        {data.photo1FileName || 'Gambar.png'}
                      </span>
                    </div>
                    {data.photo1PreviewUrl ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onChange({ photo1FileName: '', photo1PreviewUrl: '' })}
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
                    Foto Lokasi 2 (opsional)
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
                          alt="Foto 2"
                          className="border-warm-200 h-6 w-6 shrink-0 rounded border object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-4 w-4 shrink-0 text-slate-400" />
                      )}
                      <span className="text-3xs truncate font-mono text-slate-700">
                        {data.photo2FileName || 'Gambar.png'}
                      </span>
                    </div>
                    {data.photo2PreviewUrl ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onChange({ photo2FileName: '', photo2PreviewUrl: '' })}
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
                    Foto Lokasi 3 (opsional)
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
                          alt="Foto 3"
                          className="border-warm-200 h-6 w-6 shrink-0 rounded border object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-4 w-4 shrink-0 text-slate-400" />
                      )}
                      <span className="text-3xs truncate font-mono text-slate-700">
                        {data.photo3FileName || 'Gambar.png'}
                      </span>
                    </div>
                    {data.photo3PreviewUrl ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onChange({ photo3FileName: '', photo3PreviewUrl: '' })}
                        className="h-6 w-6 shrink-0 p-0 text-rose-500 hover:bg-rose-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    ) : null}
                  </div>
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
                Profil Anggota DPRD Kab. Tapin
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Foto resmi dan identitas perwakilan daerah pemilihan Anda
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center space-y-4 pt-2 text-center">
              {/* Foto Besar Wajah Dewan */}
              <div className="relative h-64 w-52 overflow-hidden rounded-2xl border-4 border-emerald-400 bg-slate-100 shadow-lg sm:h-72 sm:w-60">
                <img
                  src={previewRep.photoUrl}
                  alt={previewRep.name}
                  className="h-full w-full object-cover object-top"
                />
                <div className="from-darknavy-900/90 via-darknavy-900/40 absolute inset-x-0 bottom-0 bg-linear-to-t py-2 text-center">
                  <span className="text-xs font-black tracking-wider text-emerald-300 uppercase">
                    DPRD KABUPATEN TAPIN
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
                  Cakupan Wilayah: {previewRep.districts.join(', ')}
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
