import { useEffect, useState } from 'react';

import { and, asc, eq, inArray, isNull } from 'drizzle-orm';
import { Link, useFetcher } from 'react-router';
import { toast } from 'sonner';
import { db } from '~/db/index.server';
import { regions, userProfiles, users } from '~/db/schema/schema';
import { useRevokeBlobUrlsOnUnmount, useTicketSurvey } from '~/hooks/use-ticket-survey';
import { buildTicketSubmissionFormData } from '~/lib/ticket-form';
import { createTicket, handleSurveyAction } from '~/lib/ticket.server';
import { extractTicketAttachments } from '~/lib/upload.server';
import { INITIAL_IDENTITY_DATA, aspirationStepSchema, identityStepSchema } from '~/schema/form';

import { FeedbackAlertDialog } from '@/components/aspiration/feedback-alert-dialog';
import { FormStepper } from '@/components/aspiration/form-stepper';
import { IdentityStep } from '@/components/aspiration/identity-step';
import { ProposalStep } from '@/components/aspiration/proposal-step';

import type { IdentityFormData, UsulanFormData } from '@/types/aspiration';

import { APP_NAME } from '@/constants/index';
import { ALL_DAPIL_LIST, DAPIL_DISTRICTS_MAP, TAPIN_CENTER } from '@/constants/tapin';

import { ArrowLeft, Megaphone } from 'lucide-react';

import type { Route } from './+types/aspiration';

export const meta: Route.MetaFunction = () => [
  { title: `Formulir Usulan Aspirasi Dapil DPRD & DPR RI - ${APP_NAME}` },
  {
    name: 'description',
    content:
      'Layanan resmi penyampaian Aspirasi Pokir DPRD Kabupaten Tapin dan DPR RI Dapil Kalimantan Selatan I dengan verifikasi identitas e-KTP.',
  },
];

export async function loader() {
  const dapilRows = await db
    .select({
      id: regions.code,
      name: regions.name,
      description: regions.description,
    })
    .from(regions)
    .where(inArray(regions.type, ['dapil_dprd', 'dapil_dpr']))
    .orderBy(asc(regions.code));

  const reps = await db
    .select({
      id: userProfiles.id,
      name: userProfiles.fullName,
      role: users.role,
      party: userProfiles.party,
      commission: userProfiles.commission,
      photoUrl: userProfiles.avatarUrl,
      dapilId: regions.code,
      dapilName: regions.name,
    })
    .from(userProfiles)
    .innerJoin(users, eq(users.id, userProfiles.userId))
    .leftJoin(regions, eq(regions.id, userProfiles.regionId))
    .where(
      and(
        inArray(users.role, ['dprd', 'dpr']),
        eq(users.isActive, true),
        isNull(users.deletedAt),
        isNull(userProfiles.deletedAt)
      )
    )
    .orderBy(asc(userProfiles.fullName));

  const canonicalOrder = new Map<string, number>(ALL_DAPIL_LIST.map((d, idx) => [d.id, idx]));

  const dapils = dapilRows
    .map((d) => {
      const canonical = ALL_DAPIL_LIST.find((item) => item.id === d.id);
      const districts = DAPIL_DISTRICTS_MAP[d.id] || canonical?.districts || [];
      return {
        id: d.id,
        name: d.name,
        label:
          canonical?.label ||
          `${d.name}${districts.length > 0 ? ` (${districts.join(', ')})` : ''}`,
        seats: canonical?.seats || '',
        districts,
        description: d.description || canonical?.description || '',
      };
    })
    .sort(
      (a, b) =>
        (canonicalOrder.get(a.id) ?? Number.MAX_SAFE_INTEGER) -
        (canonicalOrder.get(b.id) ?? Number.MAX_SAFE_INTEGER)
    );

  const representatives = reps.map((r) => {
    const role: 'dprd' | 'dpr' = r.role === 'dpr' ? 'dpr' : 'dprd';
    const dapilId = r.dapilId || (role === 'dpr' ? 'DAPIL-KALSEL-1' : 'DAPIL-TAPIN-1');
    return {
      id: r.id,
      name: r.name,
      role,
      party: r.party || '',
      dapilId,
      dapilName: r.dapilName || (role === 'dpr' ? 'Dapil Kalimantan Selatan I' : 'Dapil Tapin 1'),
      districts: DAPIL_DISTRICTS_MAP[dapilId] || [],
      commission: r.commission || '',
      photoUrl: r.photoUrl || '',
    };
  });

  return { dapils, representatives };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'submit_survey') {
    return handleSurveyAction(formData);
  }

  // Primary action: Create aspiration ticket
  let identityData: unknown;
  let usulanData: unknown;

  try {
    identityData = JSON.parse(String(formData.get('identityData') || '{}'));
    usulanData = JSON.parse(String(formData.get('usulanData') || '{}'));
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

  const usulanParsed = aspirationStepSchema.safeParse(usulanData);
  if (!usulanParsed.success) {
    const fieldErrors = usulanParsed.error.flatten().fieldErrors;
    return Response.json(
      { success: false, error: 'Data usulan aspirasi tidak valid.', fieldErrors },
      { status: 400 }
    );
  }

  try {
    const rawUsulan = usulanData as UsulanFormData;
    const rawIdentity = identityData as IdentityFormData;

    const fallbackPhotoUrls = rawUsulan.photos?.map((p) => p.previewUrl) || [];

    const attachments = await extractTicketAttachments(formData, {
      idCardUrl: rawIdentity.idCardPreviewUrl,
      documentUrl: rawUsulan.proposalFileName,
      photoUrls: fallbackPhotoUrls,
    });

    if (attachments.errors.length > 0) {
      return Response.json({ success: false, error: attachments.errors[0] }, { status: 400 });
    }

    const { idCardUrl, documentUrl, photos } = attachments;

    const newTicket = await createTicket({
      type: 'dapil',
      reporterNik: identityParsed.data.nik,
      reporterName: identityParsed.data.fullName,
      reporterPhone: identityParsed.data.phone,
      reporterEmail: identityParsed.data.email || null,
      reporterAddress: identityParsed.data.ktpAddress,
      idCardUrl,
      kabupaten: 'KABUPATEN TAPIN',
      kecamatan: usulanParsed.data.kecamatan,
      kelurahan: usulanParsed.data.kelurahan,
      alamatLokasi: usulanParsed.data.alamatLokasi,
      latitude: usulanParsed.data.latitude,
      longitude: usulanParsed.data.longitude,
      title: usulanParsed.data.kamusUsulan,
      description: usulanParsed.data.permasalahan,
      representativeId: usulanParsed.data.representativeId || null,
      dapilId: usulanParsed.data.dapilId,
      kamusUsulan: usulanParsed.data.kamusUsulan,
      photos,
      documentUrl,
    });

    return Response.json({
      success: true,
      ticketNumber: newTicket.ticketNumber,
    });
  } catch (error) {
    console.error('Failed to register aspiration ticket:', error);
    return Response.json(
      {
        success: false,
        error: 'Terjadi kesalahan sistem saat menyimpan tiket aspirasi. Silakan coba lagi.',
      },
      { status: 500 }
    );
  }
}

export default function FormAspirationPage({ loaderData }: Route.ComponentProps) {
  const submitFetcher = useFetcher<{
    success: boolean;
    ticketNumber?: string;
    error?: string;
    fieldErrors?: Record<string, string[]>;
  }>();
  const {
    feedbackRating,
    feedbackAspects,
    feedbackComment,
    isSurveySubmitting,
    updateFeedback,
    submitSurvey,
  } = useTicketSurvey();

  // Wizard Step: 1 = Identitas & KTP, 2 = Form Usulan
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Step 1: Data Diri & Tanda Pengenal (KTP)
  const [identityData, setIdentityData] = useState<IdentityFormData>(INITIAL_IDENTITY_DATA);

  // Step 2: Form Usulan Aspirasi Dapil DPRD (dynamically initialized from loaderData)
  const initialRep = loaderData.representatives[0];
  const initialDapil =
    loaderData.dapils.find((d) => d.id === initialRep?.dapilId) || loaderData.dapils[0];

  const [usulanData, setUsulanData] = useState<UsulanFormData>(() => ({
    dapilId: initialDapil?.id || 'DAPIL-TAPIN-1',
    dapilName: initialDapil?.name || 'Dapil Tapin 1',
    representativeId: initialRep?.id || '',
    representativeName: initialRep?.name || '',
    representativeParty: initialRep?.party || '',
    kamusUsulan: '',
    permasalahan: '',
    latitude: TAPIN_CENTER.lat,
    longitude: TAPIN_CENTER.lng,
    alamatLokasi: '',
    kabupaten: 'Kabupaten Tapin',
    kecamatan: '',
    kelurahan: '',
    proposalFileName: '',
    proposalFile: null,
    photos: [],
  }));

  useRevokeBlobUrlsOnUnmount([
    identityData.idCardPreviewUrl,
    ...(usulanData.photos?.map((p) => p.previewUrl) || []),
  ]);

  const isSubmitting = submitFetcher.state !== 'idle';
  const ticketNumber = submitFetcher.data?.ticketNumber || '';
  const isFeedbackDialogOpen = Boolean(ticketNumber);

  useEffect(() => {
    if (submitFetcher.data && !submitFetcher.data.success && submitFetcher.data.error) {
      toast.error('Gagal Mengirim Aspirasi', {
        description: submitFetcher.data.error,
      });
    }
  }, [submitFetcher.data]);

  const handleIdentityChange = (updates: Partial<IdentityFormData>) => {
    setIdentityData((prev) => ({ ...prev, ...updates }));
  };

  const handleUsulanChange = (updates: Partial<UsulanFormData>) => {
    setUsulanData((prev) => ({ ...prev, ...updates }));
  };

  const handleGoToStepTwo = () => {
    setCurrentStep(2);
    window.scrollTo({ top: 100, behavior: 'smooth' });
    toast.info('Data diri & identitas terverifikasi.', {
      description: 'Silakan isi rincian usulan untuk perwakilan DPRD Tapin atau DPR RI.',
    });
  };

  const handleBackToIdentity = () => {
    setCurrentStep(1);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleSubmitDapil = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = buildTicketSubmissionFormData({
      intent: 'create_aspiration',
      payloadKey: 'usulanData',
      identityData,
      payloadData: usulanData,
      documentKey: 'proposalFile',
      documentFile: usulanData.proposalFile,
      photos: usulanData.photos,
    });

    submitFetcher.submit(payload, {
      method: 'post',
      encType: 'multipart/form-data',
    });
  };

  const handleFeedbackSubmit = () => {
    submitSurvey(ticketNumber);
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
            <span className="font-medium text-slate-500">Aspirasi Pokir Dapil</span>
          </div>

          <Link
            to="/form/complaint"
            className="border-warm-300 hover:border-accent-300 hover:bg-accent-50/50 hover:text-accent-600 inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-xs font-bold text-slate-600 shadow-xs transition-all"
          >
            <Megaphone className="text-accent-500 h-3.5 w-3.5" aria-hidden="true" />
            <span>Ingin lapor keluhan fasilitas umum? Tulis Aduan Masyarakat &rarr;</span>
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
          stepTwoTitle="Form Usulan Aspirasi Dapil"
          stepTwoSubtitle="Tujuan Dapil DPRD Tapin & DPR RI"
        />

        {/* Dynamic Step View */}
        {currentStep === 1 ? (
          <IdentityStep
            data={identityData}
            aspirationType="dapil"
            onChange={handleIdentityChange}
            onNext={handleGoToStepTwo}
          />
        ) : (
          <ProposalStep
            data={usulanData}
            onChange={handleUsulanChange}
            onBack={handleBackToIdentity}
            onSubmit={handleSubmitDapil}
            isSubmitting={isSubmitting}
            representatives={loaderData.representatives}
            dapils={loaderData.dapils}
          />
        )}

        {/* Post-Form Mandatory Feedback Alert Dialog */}
        <FeedbackAlertDialog
          isOpen={isFeedbackDialogOpen}
          ticketNumber={ticketNumber}
          aspirationType="dapil"
          rating={feedbackRating}
          aspects={feedbackAspects}
          feedback={feedbackComment}
          isSubmitting={isSurveySubmitting}
          onChange={updateFeedback}
          onSubmit={handleFeedbackSubmit}
        />
      </div>
    </div>
  );
}
