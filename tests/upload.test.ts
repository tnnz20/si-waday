import assert from 'node:assert/strict';
import test from 'node:test';

import { extractTicketAttachments } from '../app/lib/upload.server';

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
