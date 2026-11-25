import { useEffect, useRef, useState } from 'react';

import { useFetcher, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { revokeBlobUrls } from '~/lib/ticket-form';

import { CSAT_ASPECT_OPTIONS } from '@/constants/aspirations';

/**
 * Revokes preview blob: object URLs on component unmount without touching refs during render.
 */
export function useRevokeBlobUrlsOnUnmount(urls: Array<string | null | undefined>): void {
  const urlsRef = useRef(urls);

  useEffect(() => {
    urlsRef.current = urls;
  }, [urls]);

  useEffect(() => {
    return () => revokeBlobUrls(urlsRef.current);
  }, []);
}

const DEFAULT_SELECTED_ASPECTS = [CSAT_ASPECT_OPTIONS[0], CSAT_ASPECT_OPTIONS[1]];

/**
 * Shared citizen satisfaction survey hook handling submission state,
 * server error handling, and safe post-persistence navigation to the receipt page.
 */
export function useTicketSurvey() {
  const navigate = useNavigate();
  const surveyFetcher = useFetcher<{ success: boolean; error?: string }>();
  const prevStateRef = useRef(surveyFetcher.state);
  const pendingTicketRef = useRef('');

  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackAspects, setFeedbackAspects] = useState<string[]>(DEFAULT_SELECTED_ASPECTS);
  const [feedbackComment, setFeedbackComment] = useState('');

  useEffect(() => {
    const prevState = prevStateRef.current;
    prevStateRef.current = surveyFetcher.state;

    if (prevState !== 'idle' && surveyFetcher.state === 'idle' && pendingTicketRef.current) {
      const targetTicket = pendingTicketRef.current;
      pendingTicketRef.current = '';

      if (surveyFetcher.data?.success) {
        toast.success('Terima kasih atas penilaian Anda!', {
          description: `Bukti registrasi resmi dengan nomor ${targetTicket} siap dicetak.`,
        });
        navigate(`/form/success/${encodeURIComponent(targetTicket)}`);
      } else {
        toast.error('Gagal Menyimpan Survei', {
          description:
            surveyFetcher.data?.error ||
            'Terjadi kesalahan saat menyimpan ulasan. Silakan coba lagi.',
        });
      }
    }
  }, [surveyFetcher.state, surveyFetcher.data, navigate]);

  const submitSurvey = (ticketNumber: string) => {
    if (!ticketNumber || surveyFetcher.state !== 'idle') return;
    pendingTicketRef.current = ticketNumber;

    const formData = new FormData();
    formData.append('intent', 'submit_survey');
    formData.append('ticketNumber', ticketNumber);
    formData.append('rating', String(feedbackRating));
    formData.append('aspects', JSON.stringify(feedbackAspects));
    formData.append('feedback', feedbackComment);

    surveyFetcher.submit(formData, { method: 'post' });
  };

  return {
    feedbackRating,
    feedbackAspects,
    feedbackComment,
    isSurveySubmitting: surveyFetcher.state !== 'idle',
    updateFeedback: (updates: { rating?: number; aspects?: string[]; feedback?: string }) => {
      if (updates.rating !== undefined) setFeedbackRating(updates.rating);
      if (updates.aspects !== undefined) setFeedbackAspects(updates.aspects);
      if (updates.feedback !== undefined) setFeedbackComment(updates.feedback);
    },
    submitSurvey,
  };
}
