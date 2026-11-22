import 'dotenv/config';
import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createTicket,
  generateTicketNumber,
  getTicketByNumber,
  submitTicketSatisfaction,
} from '../app/lib/ticket.server';

test('generateTicketNumber generates valid ASP format for dapil', () => {
  const number = generateTicketNumber('dapil');
  assert.match(number, /^ASP-\d{4}-\d{4}$/);
});

test('generateTicketNumber generates valid ADU format for masyarakat', () => {
  const number = generateTicketNumber('masyarakat');
  assert.match(number, /^ADU-\d{4}-\d{4}$/);
});

test('createTicket, getTicketByNumber, and submitTicketSatisfaction work end-to-end', async () => {
  const created = await createTicket({
    type: 'dapil',
    reporterNik: '6305012345678901',
    reporterName: 'Warga Uji Coba',
    reporterPhone: '081234567890',
    reporterAddress: 'Jl. Ahmad Yani No. 12, Rantau',
    kabupaten: 'KABUPATEN TAPIN',
    kecamatan: 'TAPIN UTARA',
    kelurahan: 'Rantau Kiwa',
    alamatLokasi: 'Depan Pasar Rantau',
    latitude: -2.9304,
    longitude: 115.1485,
    description: 'Perbaikan drainase jalan utama pasar',
  });

  assert.ok(created.id);
  assert.match(created.ticketNumber, /^ASP-\d{4}-\d{4}$/);
  assert.equal(created.type, 'dapil');
  assert.equal(created.status, 'menunggu_verifikasi');

  const fetched = await getTicketByNumber(created.ticketNumber);
  assert.ok(fetched);
  assert.equal(fetched.reporterName, 'Warga Uji Coba');

  const surveyed = await submitTicketSatisfaction(created.ticketNumber, {
    rating: 5,
    aspects: ['Kecepatan Respon', 'Kemudahan Sistem'],
    feedback: 'Pelayanan responsif dan sangat membantu',
  });
  assert.ok(surveyed);
  assert.equal(surveyed.satisfactionRating, 5);
  assert.deepEqual(surveyed.satisfactionAspects, ['Kecepatan Respon', 'Kemudahan Sistem']);
  process.exit(0);
});
