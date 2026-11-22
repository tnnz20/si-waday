import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import { extractTicketAttachments } from '../app/lib/upload.server';

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

test('extractTicketAttachments uses fallback URLs when no physical files in FormData', async () => {
  const formData = new FormData();
  const result = await extractTicketAttachments(formData, {
    idCardUrl: '/uploads/ktp/sample-ktp.jpg',
    documentUrl: '/uploads/documents/sample-proposal.pdf',
    photoUrls: ['/uploads/photos/photo1.webp', undefined, '/uploads/photos/photo2.webp'],
  });

  assert.equal(result.idCardUrl, '/uploads/ktp/sample-ktp.jpg');
  assert.equal(result.documentUrl, '/uploads/documents/sample-proposal.pdf');
  assert.deepEqual(result.photos, ['/uploads/photos/photo1.webp', '/uploads/photos/photo2.webp']);
});

test('extractTicketAttachments filters out falsy fallback photo URLs cleanly', async () => {
  const formData = new FormData();
  const result = await extractTicketAttachments(formData, {
    photoUrls: [undefined, null, ''],
  });

  assert.deepEqual(result.photos, []);
});

test('extractTicketAttachments saves physical files from multi-part photos entries', async () => {
  const formData = new FormData();
  const file1 = new File(['fake-image-content-1'], 'photo1.jpg', { type: 'image/jpeg' });
  const file2 = new File(['fake-image-content-2'], 'photo2.png', { type: 'image/png' });
  formData.append('photos', file1);
  formData.append('photos', file2);

  const result = await extractTicketAttachments(formData, { photoUrls: [] });
  assert.equal(result.photos.length, 2);
  assert.match(result.photos[0], /^\/uploads\/photos\/[a-f0-9-]+\.jpg$/);
  assert.match(result.photos[1], /^\/uploads\/photos\/[a-f0-9-]+\.png$/);
  createdFiles.push(...result.photos);
});
