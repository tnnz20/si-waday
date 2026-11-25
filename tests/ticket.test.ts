import 'dotenv/config';
import { inArray } from 'drizzle-orm';
import assert from 'node:assert/strict';
import test from 'node:test';

import { db } from '../app/db/index.server';
import { tickets } from '../app/db/schema/schema';
import {
  createTicket,
  generateTicketNumber,
  getPublicTicketByNumber,
  getTicketByNumber,
  handleSurveyAction,
  maskNik,
  submitTicketSatisfaction,
} from '../app/lib/ticket.server';

const createdTicketIds: string[] = [];

test.after(async () => {
  if (createdTicketIds.length > 0) {
    await db.delete(tickets).where(inArray(tickets.id, createdTicketIds));
  }
  await db.$client.end();
});

test('generateTicketNumber generates valid ASP format for dapil', () => {
  const number = generateTicketNumber('dapil');
  assert.match(number, /^ASP-\d{4}-\d{4}$/);
});

test('generateTicketNumber generates valid ADU format for masyarakat', () => {
  const number = generateTicketNumber('masyarakat');
  assert.match(number, /^ADU-\d{4}-\d{4}$/);
});

test('maskNik hides middle digits for civic privacy', () => {
  assert.equal(maskNik('6305012345678901'), '630501******8901');
  assert.equal(maskNik('12345'), '12345');
});

test('createTicket, getTicketByNumber, getPublicTicketByNumber, and submitTicketSatisfaction work end-to-end', async () => {
  const created = await createTicket({
    type: 'dapil',
    reporterNik: '6305012345678901',
    reporterName: 'Warga Uji Coba',
    reporterPhone: '081234567890',
    reporterAddress: 'Jl. Ahmad Yani No. 12, Rantau',
    idCardUrl: '/uploads/ktp/test-ktp.jpg',
    kabupaten: 'KABUPATEN TAPIN',
    kecamatan: 'TAPIN UTARA',
    kelurahan: 'Rantau Kiwa',
    alamatLokasi: 'Depan Pasar Rantau',
    latitude: -2.9304,
    longitude: 115.1485,
    description: 'Perbaikan drainase jalan utama pasar',
  });
  createdTicketIds.push(created.id);

  assert.ok(created.id);
  assert.match(created.ticketNumber, /^ASP-\d{4}-\d{4}$/);
  assert.equal(created.type, 'dapil');
  assert.equal(created.status, 'menunggu_verifikasi');

  const fetched = await getTicketByNumber(created.ticketNumber);
  assert.ok(fetched);
  assert.equal(fetched.reporterName, 'Warga Uji Coba');

  // Public lookup must redact PII columns & internal staff/id fields
  const publicTicket = await getPublicTicketByNumber(created.ticketNumber);
  assert.ok(publicTicket);
  assert.equal(publicTicket.ticketNumber, created.ticketNumber);
  assert.equal(publicTicket.maskedNik, '630501******8901');
  assert.equal('reporterNik' in publicTicket, false);
  assert.equal('reporterPhone' in publicTicket, false);
  assert.equal('reporterEmail' in publicTicket, false);
  assert.equal('reporterAddress' in publicTicket, false);
  assert.equal('idCardUrl' in publicTicket, false);
  assert.equal('assignedTo' in publicTicket, false);
  assert.equal('id' in publicTicket, false);

  const surveyed = await submitTicketSatisfaction(created.ticketNumber, {
    rating: 5,
    aspects: ['Formulir Mudah Dipahami', 'Kecepatan Akses Lancar'],
    feedback: 'Pelayanan responsif dan sangat membantu',
  });
  assert.ok(surveyed);
  assert.equal(surveyed.rating, 5);
  assert.deepEqual(surveyed.aspects, ['Formulir Mudah Dipahami', 'Kecepatan Akses Lancar']);
  assert.equal(surveyed.type, 'submission');
});

test('handleSurveyAction returns 404 for unknown tickets and 400 for invalid payloads', async () => {
  const missingForm = new FormData();
  missingForm.append('ticketNumber', 'ASP-MISSING-0000');
  missingForm.append('rating', '5');
  missingForm.append('aspects', '[]');

  const notFoundRes = await handleSurveyAction(missingForm);
  assert.equal(notFoundRes.status, 404);
  const notFoundBody = (await notFoundRes.json()) as { success: boolean; error?: string };
  assert.equal(notFoundBody.success, false);

  const invalidForm = new FormData();
  invalidForm.append('ticketNumber', '');
  const badRequestRes = await handleSurveyAction(invalidForm);
  assert.equal(badRequestRes.status, 400);
});
