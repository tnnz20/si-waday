import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import { extractTicketAttachments, saveAttachmentFile } from '../app/lib/upload.server';

const createdFiles: string[] = [];

test.after(async () => {
  for (const relativePath of createdFiles) {
    try {
      const fullPath = path.join(process.cwd(), 'public', relativePath.replace(/^\//, ''));
      await fs.unlink(fullPath);
    } catch {
      // ignore
    }
  }
});

test('extractTicketAttachments uses persistent /uploads fallback URLs when no physical files in FormData', async () => {
  const formData = new FormData();
  const result = await extractTicketAttachments(formData, {
    idCardUrl: '/uploads/ktp/sample-ktp.jpg',
    documentUrl: '/uploads/documents/sample-proposal.pdf',
    photoUrls: ['/uploads/photos/photo1.webp', undefined, '/uploads/photos/photo2.webp'],
  });

  assert.deepEqual(result.errors, []);
  assert.equal(result.idCardUrl, '/uploads/ktp/sample-ktp.jpg');
  assert.equal(result.documentUrl, '/uploads/documents/sample-proposal.pdf');
  assert.deepEqual(result.photos, ['/uploads/photos/photo1.webp', '/uploads/photos/photo2.webp']);
});

test('extractTicketAttachments strips blob: URLs and bare filenames from fallbacks', async () => {
  const formData = new FormData();
  const result = await extractTicketAttachments(formData, {
    idCardUrl: 'blob:http://localhost:5173/1234-5678',
    documentUrl: 'Proposal.pdf',
    photoUrls: ['blob:http://localhost:5173/abcd', null, ''],
  });

  assert.deepEqual(result.errors, []);
  assert.equal(result.idCardUrl, null);
  assert.equal(result.documentUrl, null);
  assert.deepEqual(result.photos, []);
});

test('extractTicketAttachments saves physical files from multi-part photos entries', async () => {
  const formData = new FormData();
  const file1 = new File(['fake-image-content-1'], 'photo1.jpg', { type: 'image/jpeg' });
  const file2 = new File(['fake-image-content-2'], 'photo2.png', { type: 'image/png' });
  formData.append('photos', file1);
  formData.append('photos', file2);

  const result = await extractTicketAttachments(formData, { photoUrls: [] });
  assert.deepEqual(result.errors, []);
  assert.equal(result.photos.length, 2);
  assert.match(result.photos[0], /^\/uploads\/photos\/[a-f0-9-]+\.jpg$/);
  assert.match(result.photos[1], /^\/uploads\/photos\/[a-f0-9-]+\.png$/);
  createdFiles.push(...result.photos);
});

test('saveAttachmentFile validates MIME types and rejects oversized KTP PDFs', async () => {
  const spoofedFile = new File(['not-an-image'], 'evil.jpg', { type: 'text/plain' });
  const mimeRes = await saveAttachmentFile(spoofedFile, 'ktp');
  assert.equal(mimeRes.success, false);
  assert.match(mimeRes.error || '', /MIME/i);

  const oversizedBuffer = new Uint8Array(5 * 1024 * 1024 + 10);
  const largePdf = new File([oversizedBuffer], 'large-ktp.pdf', { type: 'application/pdf' });
  const sizeRes = await saveAttachmentFile(largePdf, 'ktp');
  assert.equal(sizeRes.success, false);
  assert.match(sizeRes.error || '', /5 MB/);
});

test('extractTicketAttachments returns errors and cleans up saved files if any attachment fails', async () => {
  const formData = new FormData();
  const validKtp = new File(['valid-ktp-bytes'], 'ktp.jpg', { type: 'image/jpeg' });
  const invalidPhoto = new File(['bad-mime'], 'photo.png', { type: 'text/plain' });
  formData.append('idCardFile', validKtp);
  formData.append('photos', invalidPhoto);

  const result = await extractTicketAttachments(formData, {});
  assert.equal(result.errors.length, 1);
  assert.equal(result.idCardUrl, null);
  assert.deepEqual(result.photos, []);
});
