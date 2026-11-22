import { useEffect, useState } from 'react';

import { and, asc, eq, isNull } from 'drizzle-orm';
import { Link, useFetcher, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { db } from '~/db/index.server';
import { regions, userProfiles, users } from '~/db/schema/schema';
import { createTicket, submitTicketSatisfaction } from '~/lib/ticket.server';
import { saveAttachmentFile } from '~/lib/upload.server';
import { aspirationStepSchema, identityStepSchema } from '~/schema/form';

import { IdentityStep } from '@/components/aspiration/identity-step';
import { ProposalStep } from '@/components/aspiration/proposal-step';
import { SatisfactionModal } from '@/components/aspiration/satisfaction-modal';
import { SuccessModal } from '@/components/aspiration/success-modal';

import type { IdentityFormData, UsulanFormData } from '@/types/aspiration';

import { APP_NAME } from '@/constants/index';
import { DAPIL_DISTRICTS_MAP, DESA_KELURAHAN_TAPIN_MAP } from '@/constants/tapin';

import { ArrowLeft, Check, IdCard, Megaphone, Send } from 'lucide-react';

import type { Route } from './+types/aspiration';

export const meta: Route.MetaFunction = () => [
  { title: `Formulir Usulan Pokir Dapil DPRD - ${APP_NAME}` },
  {
    name: 'description',
    content:
      'Layanan resmi penyampaian Aspirasi Pokir DPRD Kabupaten Tapin dengan verifikasi identitas e-KTP.',
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
    .where(eq(regions.type, 'dapil_dprd'))
    .orderBy(asc(regions.code));

  const reps = await db
    .select({
      id: userProfiles.id,
      name: userProfiles.fullName,
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
        eq(users.role, 'dprd'),
        eq(users.isActive, true),
        isNull(users.deletedAt),
        isNull(userProfiles.deletedAt)
      )
    )
    .orderBy(asc(userProfiles.fullName));

  const dapils = dapilRows.map((d) => ({
    id: d.id,
    name: d.name,
    label: `${d.name} (${(DAPIL_DISTRICTS_MAP[d.id] || []).join(', ')})`,
    seats: '',
    districts: DAPIL_DISTRICTS_MAP[d.id] || [],
    description: d.description || '',
  }));

  const representatives = reps.map((r) => {
    const dapilId = r.dapilId || 'DAPIL-TAPIN-1';
    return {
      id: r.id,
      name: r.name,
      party: r.party || '',
      dapilId,
      dapilName: r.dapilName || 'Dapil Tapin 1',
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
    const ticketNumber = String(formData.get('ticketNumber') || '');
    const rating = Number(formData.get('rating') || 5);
    const feedback = String(formData.get('feedback') || '');
    let aspects: string[];
    try {
      aspects = JSON.parse(String(formData.get('aspects') || '[]'));
    } catch {
      aspects = [];
    }

    if (!ticketNumber) {
      return Response.json({ success: false, error: 'Nomor tiket tidak valid.' }, { status: 400 });
    }

    await submitTicketSatisfaction(ticketNumber, { rating, aspects, feedback });
    return Response.json({ success: true });
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

    // Handle physical file uploads
    let idCardUrl = rawIdentity.idCardPreviewUrl || null;
    const idCardFile = formData.get('idCardFile');
    if (idCardFile instanceof File && idCardFile.size > 0) {
      const uploadRes = await saveAttachmentFile(idCardFile, 'ktp');
      if (uploadRes.success && uploadRes.url) {
        idCardUrl = uploadRes.url;
      }
    }

    let documentUrl = rawUsulan.proposalFileName || null;
    const proposalFile = formData.get('proposalFile');
    if (proposalFile instanceof File && proposalFile.size > 0) {
      const uploadRes = await saveAttachmentFile(proposalFile, 'document');
      if (uploadRes.success && uploadRes.url) {
        documentUrl = uploadRes.url;
      }
    }

    const uploadedPhotos: string[] = [];
    for (const key of ['photo1', 'photo2', 'photo3']) {
      const photoFile = formData.get(key);
      if (photoFile instanceof File && photoFile.size > 0) {
        const uploadRes = await saveAttachmentFile(photoFile, 'photo');
        if (uploadRes.success && uploadRes.url) {
          uploadedPhotos.push(uploadRes.url);
        }
      }
    }

    const photos =
      uploadedPhotos.length > 0
        ? uploadedPhotos
        : [
            rawUsulan.photo1PreviewUrl,
            rawUsulan.photo2PreviewUrl,
            rawUsulan.photo3PreviewUrl,
          ].filter(Boolean);

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
      ticket: newTicket,
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
  const navigate = useNavigate();
  const submitFetcher = useFetcher<{
    success: boolean;
    ticketNumber?: string;
    error?: string;
    fieldErrors?: Record<string, string[]>;
  }>();
  const surveyFetcher = useFetcher<{ success: boolean }>();

  // Wizard Step: 1 = Identitas & KTP, 2 = Form Usulan
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Step 1: Data Diri & Tanda Pengenal (KTP)
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

  // Step 2: Form Usulan Aspirasi Dapil DPRD (dynamically initialized from loaderData)
  const initialRep = loaderData.representatives[0];
  const initialDapil =
    loaderData.dapils.find((d) => d.id === initialRep?.dapilId) || loaderData.dapils[0];
  const initialKecamatan = initialDapil?.districts[0] || 'Tapin Utara';
  const initialKelurahan =
    DESA_KELURAHAN_TAPIN_MAP[initialKecamatan]?.[0] || 'Rantau Kiwa (Kelurahan)';

  const [usulanData, setUsulanData] = useState<UsulanFormData>(() => ({
    dapilId: initialDapil?.id || 'DAPIL-TAPIN-1',
    dapilName: initialDapil?.name || 'Dapil Tapin 1',
    representativeId: initialRep?.id || '',
    representativeName: initialRep?.name || '',
    representativeParty: initialRep?.party || '',
    kamusUsulan: 'Perbaikan Rumah Tidak Layak Huni (RTLH)',
    permasalahan: '',
    latitude: -2.9381,
    longitude: 115.1524,
    alamatLokasi: '',
    kabupaten: 'Kabupaten Tapin',
    kecamatan: initialKecamatan,
    kelurahan: initialKelurahan,
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
  }));

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
      description: 'Silakan isi rincian usulan untuk Dapil DPRD Kabupaten Tapin.',
    });
  };

  const handleBackToIdentity = () => {
    setCurrentStep(1);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleSubmitDapil = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append('intent', 'create_aspiration');
    payload.append('identityData', JSON.stringify(identityData));
    payload.append('usulanData', JSON.stringify(usulanData));

    if (identityData.idCardFile) {
      payload.append('idCardFile', identityData.idCardFile);
    }
    if (usulanData.proposalFile) {
      payload.append('proposalFile', usulanData.proposalFile);
    }
    if (usulanData.photo1File) payload.append('photo1', usulanData.photo1File);
    if (usulanData.photo2File) payload.append('photo2', usulanData.photo2File);
    if (usulanData.photo3File) payload.append('photo3', usulanData.photo3File);

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
          rating: String(usulanData.satisfactionRating),
          aspects: JSON.stringify(usulanData.satisfactionAspects),
          feedback: usulanData.satisfactionFeedback,
        },
        { method: 'post' }
      );
    }

    toast.success('Aspirasi Dapil Berhasil Dikirim!', {
      description: `Nomor Tiket: ${ticketNumber}. Terindeks untuk ${usulanData.dapilName}.`,
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
            <span className="font-medium text-slate-500">Aspirasi Pokir Dapil DPRD</span>
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
                    <span className="text-2xs rounded-full bg-emerald-200/60 px-1.5 py-0.5 font-bold text-emerald-800">
                      Selesai
                    </span>
                  ) : null}
                </div>
                <p className="truncate text-xs font-extrabold sm:text-sm">
                  Data Diri &amp; Kartu Tanda Pengenal
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
                  currentStep === 2 ? 'bg-emerald-600 text-white' : 'bg-white text-slate-400'
                }`}
              >
                <Send className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <span className="text-2xs font-extrabold tracking-wider uppercase opacity-80">
                  Langkah 2
                </span>
                <p className="truncate text-xs font-extrabold sm:text-sm">
                  Form Usulan Aspirasi Dapil
                </p>
                <p className="text-2xs truncate opacity-75">Tujuan Dapil DPRD Kabupaten Tapin</p>
              </div>
            </button>
          </div>
        </div>

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

        {/* Post-Form Satisfaction Survey Modal */}
        <SatisfactionModal
          isOpen={isSatisfactionModalOpen}
          onClose={() => handleFinalizeSubmission(false)}
          rating={usulanData.satisfactionRating}
          aspects={usulanData.satisfactionAspects}
          feedback={usulanData.satisfactionFeedback}
          onChange={(updates) => {
            handleUsulanChange({
              satisfactionRating:
                updates.rating !== undefined ? updates.rating : usulanData.satisfactionRating,
              satisfactionAspects:
                updates.aspects !== undefined ? updates.aspects : usulanData.satisfactionAspects,
              satisfactionFeedback:
                updates.feedback !== undefined ? updates.feedback : usulanData.satisfactionFeedback,
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
          aspirationType="dapil"
          author={identityData.fullName || 'Warga Tapin'}
          targetDestination={usulanData.dapilName}
          summaryTitle={usulanData.kamusUsulan}
          kecamatan={usulanData.kecamatan}
          kelurahan={usulanData.kelurahan}
          satisfactionRating={usulanData.satisfactionRating}
          onTrackTicket={handleTrackTicket}
        />
      </div>
    </div>
  );
}
