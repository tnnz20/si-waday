import { useEffect, useState } from 'react';

import { Link, useFetcher, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { createTicket, handleSurveyAction } from '~/lib/ticket.server';
import { extractTicketAttachments } from '~/lib/upload.server';
import { INITIAL_IDENTITY_DATA, complaintStepSchema, identityStepSchema } from '~/schema/form';

import { FormStepper } from '@/components/aspiration/form-stepper';
import { IdentityStep } from '@/components/aspiration/identity-step';
import { PublicComplaintStep } from '@/components/aspiration/public-complaint-step';
import { SatisfactionModal } from '@/components/aspiration/satisfaction-modal';
import { SuccessModal } from '@/components/aspiration/success-modal';

import type { IdentityFormData, PublicComplaintFormData } from '@/types/aspiration';

import { AGENCIES, CATEGORIES } from '@/constants/aspirations';
import { APP_NAME } from '@/constants/index';
import { DESA_KELURAHAN_TAPIN_MAP } from '@/constants/tapin';

import { ArrowLeft, Landmark } from 'lucide-react';

import type { Route } from './+types/complaint';

export const meta: Route.MetaFunction = () => [
  { title: `Formulir Aduan Masyarakat - ${APP_NAME}` },
  {
    name: 'description',
    content:
      'Layanan resmi pengaduan masyarakat untuk pengawasan Komisi DPRD dan Pemerintah Kabupaten Tapin.',
  },
];

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'submit_survey') {
    return handleSurveyAction(formData);
  }

  // Primary action: Create public complaint ticket
  let identityData: unknown;
  let complaintData: unknown;

  try {
    identityData = JSON.parse(String(formData.get('identityData') || '{}'));
    complaintData = JSON.parse(String(formData.get('complaintData') || '{}'));
  } catch {
    return Response.json(
      { success: false, error: 'Format data formulir tidak valid.' },
      { status: 400 }
    );
  }

  const identityParsed = identityStepSchema.safeParse(identityData);
  if (!identityParsed.success) {
    const fieldErrors = identityParsed.error.flatten().fieldErrors;
    return Response.json(
      { success: false, error: 'Data identitas pelapor tidak valid.', fieldErrors },
      { status: 400 }
    );
  }

  const complaintParsed = complaintStepSchema.safeParse(complaintData);
  if (!complaintParsed.success) {
    const fieldErrors = complaintParsed.error.flatten().fieldErrors;
    return Response.json(
      { success: false, error: 'Data keluhan aduan tidak valid.', fieldErrors },
      { status: 400 }
    );
  }

  try {
    const rawComplaint = complaintData as PublicComplaintFormData;
    const rawIdentity = identityData as IdentityFormData;

    const fallbackPhotoUrls =
      rawComplaint.photos && rawComplaint.photos.length > 0
        ? rawComplaint.photos.map((p) => p.previewUrl)
        : [
            rawComplaint.photo1PreviewUrl,
            rawComplaint.photo2PreviewUrl,
            rawComplaint.photo3PreviewUrl,
          ];

    const { idCardUrl, documentUrl, photos } = await extractTicketAttachments(formData, {
      idCardUrl: rawIdentity.idCardPreviewUrl,
      documentUrl: rawComplaint.documentFileName,
      photoUrls: fallbackPhotoUrls,
    });

    const newTicket = await createTicket({
      type: 'masyarakat',
      reporterNik: identityParsed.data.nik,
      reporterName: identityParsed.data.fullName,
      reporterPhone: identityParsed.data.phone,
      reporterEmail: identityParsed.data.email || null,
      reporterAddress: identityParsed.data.ktpAddress,
      idCardUrl,
      kabupaten: 'KABUPATEN TAPIN',
      kecamatan: complaintParsed.data.kecamatan,
      kelurahan: complaintParsed.data.kelurahan,
      alamatLokasi: complaintParsed.data.alamatLokasi,
      latitude: complaintParsed.data.latitude,
      longitude: complaintParsed.data.longitude,
      title: complaintParsed.data.title,
      description: complaintParsed.data.content,
      agency: complaintParsed.data.agency,
      category: complaintParsed.data.category,
      photos,
      documentUrl,
    });

    return Response.json({
      success: true,
      ticketNumber: newTicket.ticketNumber,
      ticket: newTicket,
    });
  } catch (error) {
    console.error('Failed to register complaint ticket:', error);
    return Response.json(
      {
        success: false,
        error: 'Terjadi kesalahan sistem saat menyimpan tiket aduan. Silakan coba lagi.',
      },
      { status: 500 }
    );
  }
}

export default function FormComplaintPage() {
  const navigate = useNavigate();
  const submitFetcher = useFetcher<{
    success: boolean;
    ticketNumber?: string;
    error?: string;
    fieldErrors?: Record<string, string[]>;
  }>();
  const surveyFetcher = useFetcher<{ success: boolean }>();

  // Wizard Step: 1 = Identitas & KTP, 2 = Form Aduan
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Step 1: Data Diri & Tanda Pengenal (KTP)
  const [identityData, setIdentityData] = useState<IdentityFormData>(INITIAL_IDENTITY_DATA);

  // Step 2: Form Aduan Masyarakat ke DPRD Kabupaten Tapin
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
    photos: [],
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

  const [isSatisfactionDismissed, setIsSatisfactionDismissed] = useState(false);
  const [isSuccessDismissed, setIsSuccessDismissed] = useState(false);

  const isSubmitting = submitFetcher.state === 'submitting';
  const ticketNumber = submitFetcher.data?.ticketNumber || '';
  const isSatisfactionModalOpen = Boolean(ticketNumber && !isSatisfactionDismissed);
  const isSuccessModalOpen = Boolean(
    ticketNumber && isSatisfactionDismissed && !isSuccessDismissed
  );

  useEffect(() => {
    if (submitFetcher.data && !submitFetcher.data.success && submitFetcher.data.error) {
      toast.error('Gagal Mengirim Aduan', {
        description: submitFetcher.data.error,
      });
    }
  }, [submitFetcher.data]);

  const handleIdentityChange = (updates: Partial<IdentityFormData>) => {
    setIdentityData((prev) => ({ ...prev, ...updates }));
  };

  const handleComplaintChange = (updates: Partial<PublicComplaintFormData>) => {
    setComplaintData((prev) => ({ ...prev, ...updates }));
  };

  const handleGoToStepTwo = () => {
    setCurrentStep(2);
    window.scrollTo({ top: 100, behavior: 'smooth' });
    toast.info('Data diri & identitas terverifikasi.', {
      description:
        'Silakan isi rincian keluhan untuk ditindaklanjuti dan diawasi DPRD Kabupaten Tapin.',
    });
  };

  const handleBackToIdentity = () => {
    setCurrentStep(1);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleSubmitMasyarakat = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append('intent', 'create_complaint');
    payload.append('identityData', JSON.stringify(identityData));
    payload.append('complaintData', JSON.stringify(complaintData));

    if (identityData.idCardFile) {
      payload.append('idCardFile', identityData.idCardFile);
    }
    if (complaintData.documentFile) {
      payload.append('documentFile', complaintData.documentFile);
    }
    if (complaintData.photos && complaintData.photos.length > 0) {
      for (const item of complaintData.photos) {
        if (item.file) payload.append('photos', item.file);
      }
    } else {
      if (complaintData.photo1File) payload.append('photo1', complaintData.photo1File);
      if (complaintData.photo2File) payload.append('photo2', complaintData.photo2File);
      if (complaintData.photo3File) payload.append('photo3', complaintData.photo3File);
    }

    submitFetcher.submit(payload, {
      method: 'post',
      encType: 'multipart/form-data',
    });
  };

  const handleFinalizeSubmission = (withSurvey: boolean) => {
    setIsSatisfactionDismissed(true);

    if (withSurvey && ticketNumber) {
      surveyFetcher.submit(
        {
          intent: 'submit_survey',
          ticketNumber,
          rating: String(complaintData.satisfactionRating),
          aspects: JSON.stringify(complaintData.satisfactionAspects),
          feedback: complaintData.satisfactionFeedback,
        },
        { method: 'post' }
      );
    }

    toast.success('Aduan Masyarakat Berhasil Dikirim!', {
      description: `Nomor Tiket: ${ticketNumber}. Diteruskan ke ${complaintData.agency}.`,
    });

    if (withSurvey) {
      toast.info('Terima kasih atas ulasan kepuasan Anda!', {
        description: 'Penilaian Anda membantu kami terus menyempurnakan aplikasi SI-WADAY.',
      });
    }
  };

  const handleCloseSuccess = () => {
    setIsSuccessDismissed(true);
    navigate('/');
  };

  const handleTrackTicket = () => {
    setIsSuccessDismissed(true);
    navigate('/#lacak-tiket');
  };

  return (
    <div className="py-8 sm:py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Context Navigation & Switch Link */}
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-xs">
            <Link
              to="/"
              className="text-darknavy-900 hover:text-accent-500 inline-flex items-center gap-1.5 font-bold transition-colors"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Kembali ke Beranda</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="font-medium text-slate-500">Aduan Pengawasan Masyarakat</span>
          </div>

          <Link
            to="/form/aspiration"
            className="border-warm-300 inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-xs font-bold text-slate-600 shadow-xs transition-all hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-700"
          >
            <Landmark className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
            <span>Ingin usulan pokok pikiran dewan? Tulis Aspirasi Dapil &rarr;</span>
          </Link>
        </div>

        {/* Stepper Progress Bar */}
        <FormStepper
          currentStep={currentStep}
          onStepClick={(step) => {
            if (step === 1) handleBackToIdentity();
            else handleGoToStepTwo();
          }}
          reporterName={identityData.fullName}
          canGoToStepTwo={Boolean(identityData.fullName && identityData.nik)}
          stepTwoTitle="Formulir Aduan Masyarakat"
          stepTwoSubtitle="Tujuan Komisi & Pengawasan DPRD Tapin"
        />

        {/* Dynamic Step View */}
        {currentStep === 1 ? (
          <IdentityStep
            data={identityData}
            aspirationType="masyarakat"
            onChange={handleIdentityChange}
            onNext={handleGoToStepTwo}
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
          rating={complaintData.satisfactionRating}
          aspects={complaintData.satisfactionAspects}
          feedback={complaintData.satisfactionFeedback}
          onChange={(updates) => {
            handleComplaintChange({
              satisfactionRating:
                updates.rating !== undefined ? updates.rating : complaintData.satisfactionRating,
              satisfactionAspects:
                updates.aspects !== undefined ? updates.aspects : complaintData.satisfactionAspects,
              satisfactionFeedback:
                updates.feedback !== undefined
                  ? updates.feedback
                  : complaintData.satisfactionFeedback,
            });
          }}
          onSubmit={() => handleFinalizeSubmission(true)}
          onSkip={() => handleFinalizeSubmission(false)}
        />

        {/* Success Modal / Ticket Receipt */}
        <SuccessModal
          isOpen={isSuccessModalOpen}
          onClose={handleCloseSuccess}
          ticketId={ticketNumber}
          aspirationType="masyarakat"
          author={identityData.fullName || 'Warga Tapin'}
          targetDestination={complaintData.agency}
          summaryTitle={complaintData.title}
          kecamatan={complaintData.kecamatan}
          kelurahan={complaintData.kelurahan}
          satisfactionRating={complaintData.satisfactionRating}
          onTrackTicket={handleTrackTicket}
        />
      </div>
    </div>
  );
}
