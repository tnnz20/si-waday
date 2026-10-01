import { useState } from 'react';

import { Link, useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';

import { IdentityStep } from '@/components/aspiration/identity-step';
import { ProposalStep } from '@/components/aspiration/proposal-step';
import { PublicComplaintStep } from '@/components/aspiration/public-complaint-step';
import { SatisfactionModal } from '@/components/aspiration/satisfaction-modal';
import { SuccessModal } from '@/components/aspiration/success-modal';

import type {
  AspirationType,
  IdentityFormData,
  PublicComplaintFormData,
  UsulanFormData,
} from '@/types/aspiration';

import { AGENCIES, CATEGORIES } from '@/constants/aspirations';
import { APP_NAME } from '@/constants/index';
import { DESA_KELURAHAN_TAPIN_MAP } from '@/constants/tapin';

import { ArrowLeft, Check, IdCard, Landmark, Megaphone, Send } from 'lucide-react';

import type { Route } from './+types/aspiration';

export const meta: Route.MetaFunction = () => [
  { title: `Tulis Aduan & Aspirasi Warga - ${APP_NAME}` },
  {
    name: 'description',
    content:
      'Layanan resmi penyampaian Aduan Masyarakat dan Aspirasi Pokir DPRD Kabupaten Tapin dengan verifikasi identitas e-KTP.',
  },
];

export default function AspirationPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Mode: 'masyarakat' or 'dapil'
  const initialType: AspirationType =
    searchParams.get('type') === 'masyarakat' ? 'masyarakat' : 'dapil';
  const [aspirationType, setAspirationType] = useState<AspirationType>(initialType);

  // Wizard Step: 1 = Identitas & KTP, 2 = Form Usulan/Aduan
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Shared Step 1: Data Diri & Tanda Pengenal (KTP)
  const [identityData, setIdentityData] = useState<IdentityFormData>({
    nik: '',
    fullName: '',
    phone: '',
    email: '',
    ktpAddress: '',
    identityType: 'e-KTP (Kartu Tanda Penduduk)',
    idCardFileName: '',
    idCardPreviewUrl: '',
  });

  // Step 2 (Dapil): Form Usulan Aspirasi Dapil DPRD
  const [usulanData, setUsulanData] = useState<UsulanFormData>({
    dapilId: 'dapil-1',
    dapilName: 'Dapil Tapin 1',
    representativeId: 'dewan-1',
    representativeName: 'H. Daritaniansyah',
    representativeParty: 'Partai Golkar',
    kamusUsulan: 'Perbaikan Rumah Tidak Layak Huni (RTLH)',
    permasalahan: '',
    latitude: -2.9381,
    longitude: 115.1524,
    alamatLokasi: '',
    kabupaten: 'Kabupaten Tapin',
    kecamatan: 'Tapin Utara',
    kelurahan: DESA_KELURAHAN_TAPIN_MAP['Tapin Utara']?.[0] || 'Rantau Kiwa (Kelurahan)',
    proposalFileName: '',
    photo1PreviewUrl: '',
    photo1FileName: '',
    photo2PreviewUrl: '',
    photo2FileName: '',
    photo3PreviewUrl: '',
    photo3FileName: '',
    satisfactionRating: 5,
    satisfactionAspects: ['Kemudahan Formulir', 'Kecepatan Proses'],
    satisfactionFeedback: '',
  });

  // Step 2 (Masyarakat): Form Aduan Masyarakat ke DPRD Kabupaten Tapin
  const [complaintData, setComplaintData] = useState<PublicComplaintFormData>({
    category: CATEGORIES[1] || 'Infrastruktur',
    agency: AGENCIES[0] || 'Komisi I DPRD (Pemerintahan & Hukum)',
    title: '',
    content: '',
    latitude: -2.9381,
    longitude: 115.1524,
    alamatLokasi: '',
    kabupaten: 'Kabupaten Tapin',
    kecamatan: 'Tapin Utara',
    kelurahan: DESA_KELURAHAN_TAPIN_MAP['Tapin Utara']?.[0] || 'Rantau Kiwa (Kelurahan)',
    photo1PreviewUrl: '',
    photo1FileName: '',
    photo2PreviewUrl: '',
    photo2FileName: '',
    photo3PreviewUrl: '',
    photo3FileName: '',
    documentFileName: '',
    satisfactionRating: 5,
    satisfactionAspects: ['Kemudahan Formulir', 'Kecepatan Proses'],
    satisfactionFeedback: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicketId, setSubmittedTicketId] = useState('');
  const [isSatisfactionModalOpen, setIsSatisfactionModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleIdentityChange = (updates: Partial<IdentityFormData>) => {
    setIdentityData((prev) => ({ ...prev, ...updates }));
  };

  const handleUsulanChange = (updates: Partial<UsulanFormData>) => {
    setUsulanData((prev) => ({ ...prev, ...updates }));
  };

  const handleComplaintChange = (updates: Partial<PublicComplaintFormData>) => {
    setComplaintData((prev) => ({ ...prev, ...updates }));
  };

  const handleSwitchType = (type: AspirationType) => {
    setAspirationType(type);
    setSearchParams({ type });
    toast.info(
      type === 'dapil'
        ? 'Beralih ke Formulir Aspirasi Dapil DPRD Tapin'
        : 'Beralih ke Formulir Aduan Pengawasan DPRD Tapin'
    );
  };

  const handleGoToStepTwo = () => {
    setCurrentStep(2);
    window.scrollTo({ top: 100, behavior: 'smooth' });
    toast.info('Data diri & identitas terverifikasi.', {
      description:
        aspirationType === 'dapil'
          ? 'Silakan isi rincian usulan untuk Dapil DPRD Kabupaten Tapin.'
          : 'Silakan isi rincian keluhan untuk ditindaklanjuti dan diawasi DPRD Kabupaten Tapin.',
    });
  };

  const handleBackToIdentity = () => {
    setCurrentStep(1);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleSubmitDapil = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newTicketId = `ASP-2026-${randomSuffix}`;
    setSubmittedTicketId(newTicketId);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSatisfactionModalOpen(true);
    }, 400);
  };

  const handleSubmitMasyarakat = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newTicketId = `ADU-2026-${randomSuffix}`;
    setSubmittedTicketId(newTicketId);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSatisfactionModalOpen(true);
    }, 400);
  };

  const handleFinalizeSubmission = (withSurvey: boolean) => {
    setIsSatisfactionModalOpen(false);
    setIsSuccessModalOpen(true);

    if (isDapil) {
      toast.success('Aspirasi Dapil Berhasil Dikirim!', {
        description: `Nomor Tiket: ${submittedTicketId}. Terindeks untuk ${usulanData.dapilName}.`,
      });
    } else {
      toast.success('Aduan Masyarakat Berhasil Dikirim!', {
        description: `Nomor Tiket: ${submittedTicketId}. Diteruskan ke ${complaintData.agency}.`,
      });
    }

    if (withSurvey) {
      toast.info('Terima kasih atas ulasan kepuasan Anda!', {
        description: 'Penilaian Anda membantu kami terus menyempurnakan aplikasi SI-WADAY.',
      });
    }
  };

  const handleCloseSuccess = () => {
    setIsSuccessModalOpen(false);
    navigate('/');
  };

  const handleTrackTicket = () => {
    setIsSuccessModalOpen(false);
    navigate('/#lacak-tiket');
  };

  const isDapil = aspirationType === 'dapil';

  return (
    <div className="py-8 sm:py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb / Back button */}
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <Link
            to="/"
            className="text-darknavy-900 hover:text-accent-500 inline-flex items-center gap-2 text-xs font-bold transition-colors"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Kembali ke Beranda Si Waday</span>
          </Link>

          {/* Type Toggle Tabs */}
          <div className="border-warm-300 inline-flex rounded-full border bg-white p-1 shadow-xs">
            <button
              type="button"
              onClick={() => handleSwitchType('masyarakat')}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                !isDapil
                  ? 'bg-accent-500 text-white shadow-xs'
                  : 'hover:text-darknavy-900 text-slate-600'
              }`}
            >
              <Megaphone className="h-3.5 w-3.5" aria-hidden="true" />
              <span>1. Aduan Masyarakat</span>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchType('dapil')}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                isDapil
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'hover:text-darknavy-900 text-slate-600'
              }`}
            >
              <Landmark className="h-3.5 w-3.5" aria-hidden="true" />
              <span>2. Aspirasi Dapil DPRD</span>
            </button>
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div className="border-warm-200 mb-8 rounded-3xl border bg-white p-4 shadow-xs sm:p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Step 1 Pill */}
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`flex items-center gap-3.5 rounded-2xl p-3 text-left transition-all ${
                currentStep === 1
                  ? 'bg-darknavy-900 text-white shadow-md'
                  : currentStep > 1
                    ? 'border border-emerald-200 bg-emerald-50/70 text-emerald-900 hover:bg-emerald-100/70'
                    : 'bg-warm-100 text-slate-500'
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold transition-colors ${
                  currentStep === 1
                    ? 'bg-accent-500 text-white'
                    : currentStep > 1
                      ? 'bg-emerald-500 text-white'
                      : 'text-darknavy-900 bg-white'
                }`}
              >
                {currentStep > 1 ? (
                  <Check className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <IdCard className="h-5 w-5" aria-hidden="true" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-2xs font-extrabold tracking-wider uppercase opacity-80">
                    Langkah 1
                  </span>
                  {currentStep > 1 ? (
                    <span className="py-0.2 text-3xs rounded-full bg-emerald-200/60 px-1.5 font-bold text-emerald-800">
                      Selesai
                    </span>
                  ) : null}
                </div>
                <p className="truncate text-xs font-extrabold sm:text-sm">
                  Data Diri & Kartu Tanda Pengenal
                </p>
                <p className="text-2xs truncate opacity-75">
                  {identityData.fullName ? identityData.fullName : 'e-KTP Pelapor'}
                </p>
              </div>
            </button>

            {/* Step 2 Pill */}
            <button
              type="button"
              onClick={() => {
                if (identityData.fullName && identityData.nik) {
                  setCurrentStep(2);
                }
              }}
              disabled={!identityData.fullName || !identityData.nik}
              className={`flex items-center gap-3.5 rounded-2xl p-3 text-left transition-all ${
                currentStep === 2
                  ? 'bg-darknavy-900 text-white shadow-md'
                  : 'bg-warm-100 hover:bg-warm-200 text-slate-500'
              } ${!identityData.fullName || !identityData.nik ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold transition-colors ${
                  currentStep === 2
                    ? isDapil
                      ? 'bg-emerald-600 text-white'
                      : 'bg-accent-500 text-white'
                    : 'bg-white text-slate-400'
                }`}
              >
                <Send className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <span className="text-2xs font-extrabold tracking-wider uppercase opacity-80">
                  Langkah 2
                </span>
                <p className="truncate text-xs font-extrabold sm:text-sm">
                  {isDapil ? 'Form Usulan Aspirasi Dapil' : 'Formulir Aduan Masyarakat'}
                </p>
                <p className="text-2xs truncate opacity-75">
                  {isDapil
                    ? 'Tujuan Dapil DPRD Kabupaten Tapin'
                    : 'Tujuan Komisi & Pengawasan DPRD Tapin'}
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Dynamic Step View */}
        {currentStep === 1 ? (
          <IdentityStep
            data={identityData}
            aspirationType={aspirationType}
            onChange={handleIdentityChange}
            onNext={handleGoToStepTwo}
          />
        ) : isDapil ? (
          <ProposalStep
            data={usulanData}
            onChange={handleUsulanChange}
            onBack={handleBackToIdentity}
            onSubmit={handleSubmitDapil}
            isSubmitting={isSubmitting}
          />
        ) : (
          <PublicComplaintStep
            data={complaintData}
            onChange={handleComplaintChange}
            onBack={handleBackToIdentity}
            onSubmit={handleSubmitMasyarakat}
            isSubmitting={isSubmitting}
          />
        )}

        {/* Post-Form Satisfaction Survey Modal */}
        <SatisfactionModal
          isOpen={isSatisfactionModalOpen}
          onClose={() => handleFinalizeSubmission(false)}
          rating={isDapil ? usulanData.satisfactionRating : complaintData.satisfactionRating}
          aspects={isDapil ? usulanData.satisfactionAspects : complaintData.satisfactionAspects}
          feedback={isDapil ? usulanData.satisfactionFeedback : complaintData.satisfactionFeedback}
          onChange={(updates) => {
            if (isDapil) {
              handleUsulanChange({
                satisfactionRating:
                  updates.rating !== undefined ? updates.rating : usulanData.satisfactionRating,
                satisfactionAspects:
                  updates.aspects !== undefined ? updates.aspects : usulanData.satisfactionAspects,
                satisfactionFeedback:
                  updates.feedback !== undefined
                    ? updates.feedback
                    : usulanData.satisfactionFeedback,
              });
            } else {
              handleComplaintChange({
                satisfactionRating:
                  updates.rating !== undefined ? updates.rating : complaintData.satisfactionRating,
                satisfactionAspects:
                  updates.aspects !== undefined
                    ? updates.aspects
                    : complaintData.satisfactionAspects,
                satisfactionFeedback:
                  updates.feedback !== undefined
                    ? updates.feedback
                    : complaintData.satisfactionFeedback,
              });
            }
          }}
          onSubmit={() => handleFinalizeSubmission(true)}
          onSkip={() => handleFinalizeSubmission(false)}
        />

        {/* Success Modal / Ticket Receipt */}
        <SuccessModal
          isOpen={isSuccessModalOpen}
          onClose={handleCloseSuccess}
          ticketId={submittedTicketId}
          aspirationType={aspirationType}
          author={identityData.fullName || 'Warga Tapin'}
          targetDestination={isDapil ? usulanData.dapilName : complaintData.agency}
          summaryTitle={isDapil ? usulanData.kamusUsulan : complaintData.title}
          kecamatan={isDapil ? usulanData.kecamatan : complaintData.kecamatan}
          kelurahan={isDapil ? usulanData.kelurahan : complaintData.kelurahan}
          satisfactionRating={
            isDapil ? usulanData.satisfactionRating : complaintData.satisfactionRating
          }
          onTrackTicket={handleTrackTicket}
        />
      </div>
    </div>
  );
}
