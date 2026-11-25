import 'dotenv/config';
import { inArray } from 'drizzle-orm';
import assert from 'node:assert/strict';
import test from 'node:test';

import { db } from '../app/db/index.server';
import { tickets } from '../app/db/schema/schema';
import {
  createTicket,
  getCsatAnalytics,
  getTicketFeedbacks,
  submitTicketSatisfaction,
} from '../app/lib/ticket.server';

const createdTicketIds: string[] = [];

test.after(async () => {
  if (createdTicketIds.length > 0) {
    await db.delete(tickets).where(inArray(tickets.id, createdTicketIds));
  }
  await db.$client.end();
});

test('submitTicketSatisfaction inserts into ticket_feedbacks and supports multi-stage surveys', async () => {
  // 1. Create a ticket
  const ticket = await createTicket({
    type: 'masyarakat',
    reporterNik: '6305019988770002',
    reporterName: 'Warga Survei',
    reporterPhone: '081299887766',
    reporterAddress: 'Jl. Melati No. 5',
    kabupaten: 'KABUPATEN TAPIN',
    kecamatan: 'Tapin Utara',
    kelurahan: 'Rantau Kiwa (Kelurahan)',
    alamatLokasi: 'Depan Kantor Kelurahan',
    latitude: -2.935,
    longitude: 115.15,
    title: 'Uji Coba Multi-Stage Feedback',
    description: 'Pengecekan decoupling survei kepuasan',
  });
  createdTicketIds.push(ticket.id);

  assert.ok(ticket.id);

  // 2. Submit initial submission feedback
  const submissionFeedback = await submitTicketSatisfaction(
    ticket.ticketNumber,
    {
      rating: 5,
      aspects: ['Formulir Mudah Dipahami', 'Kecepatan Akses Lancar'],
      feedback: 'Formulir sangat mudah diakses.',
    },
    'submission'
  );

  assert.ok(submissionFeedback.id);
  assert.equal(submissionFeedback.ticketId, ticket.id);
  assert.equal(submissionFeedback.type, 'submission');
  assert.equal(submissionFeedback.rating, 5);
  assert.deepEqual(submissionFeedback.aspects, [
    'Formulir Mudah Dipahami',
    'Kecepatan Akses Lancar',
  ]);

  // 3. Submit resolution feedback for the same ticket (multi-stage)
  const resolutionFeedback = await submitTicketSatisfaction(
    ticket.ticketNumber,
    {
      rating: 4,
      aspects: ['Transparansi Alur Aduan'],
      feedback: 'Penanganan sudah baik dan tuntas.',
    },
    'resolution'
  );

  assert.ok(resolutionFeedback.id);
  assert.equal(resolutionFeedback.ticketId, ticket.id);
  assert.equal(resolutionFeedback.type, 'resolution');
  assert.equal(resolutionFeedback.rating, 4);

  // 4. Retrieve feedbacks for this ticket
  const list = await getTicketFeedbacks(ticket.id);
  assert.ok(list.length >= 2);
  const types = list.map((f) => f.type);
  assert.ok(types.includes('submission'));
  assert.ok(types.includes('resolution'));

  // 5. Test getCsatAnalytics
  const analytics = await getCsatAnalytics();
  assert.ok(analytics.totalReviews >= 2);
  assert.ok(analytics.averageRating > 0 && analytics.averageRating <= 5);
  assert.equal(analytics.distribution.length, 5);
  assert.ok(Array.isArray(analytics.aspectRatings));
});
