import type { FormPhotoItem, IdentityFormData } from '@/types/aspiration';

/**
 * Safely revoke client blob: object URLs to prevent memory leaks.
 */
export function revokeBlobUrls(urls: Array<string | null | undefined>): void {
  for (const url of urls) {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  }
}

interface TicketFormDataInput {
  intent: 'create_aspiration' | 'create_complaint';
  payloadKey: 'usulanData' | 'complaintData';
  identityData: IdentityFormData;
  payloadData: object;
  documentKey: 'proposalFile' | 'documentFile';
  documentFile?: File | null;
  photos?: FormPhotoItem[];
}

/**
 * Build multipart FormData payload shared between aspiration and complaint route submissions.
 */
export function buildTicketSubmissionFormData({
  intent,
  payloadKey,
  identityData,
  payloadData,
  documentKey,
  documentFile,
  photos,
}: TicketFormDataInput): FormData {
  const payload = new FormData();
  payload.append('intent', intent);
  payload.append('identityData', JSON.stringify(identityData));
  payload.append(payloadKey, JSON.stringify(payloadData));

  if (identityData.idCardFile) {
    payload.append('idCardFile', identityData.idCardFile);
  }
  if (documentFile) {
    payload.append(documentKey, documentFile);
  }
  if (photos && photos.length > 0) {
    for (const item of photos) {
      if (item.file) {
        payload.append('photos', item.file);
      }
    }
  }

  return payload;
}
