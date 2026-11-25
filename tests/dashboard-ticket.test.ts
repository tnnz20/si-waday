import 'dotenv/config';
import { eq, inArray } from 'drizzle-orm';
import assert from 'node:assert/strict';
import test from 'node:test';

import { db } from '../app/db/index.server';
import { auditLogs, tickets } from '../app/db/schema/schema';
import {
  createTicket,
  getAdminTicketDetail,
  getCsatAnalytics,
  getDashboardOverviewStats,
  getDashboardTickets,
  getPaginatedCsatReviews,
  submitTicketSatisfaction,
  updateTicketStatus,
} from '../app/lib/ticket.server';

const createdTicketIds: string[] = [];
const createdTicketNumbers: string[] = [];

test.after(async () => {
  if (createdTicketNumbers.length > 0) {
    await db.delete(auditLogs).where(inArray(auditLogs.entityId, createdTicketNumbers));
  }
  if (createdTicketIds.length > 0) {
    await db.delete(tickets).where(inArray(tickets.id, createdTicketIds));
  }
  await db.$client.end();
});

test('dashboard queries return real DB tickets, stats, detail, and paginated CSAT (pageSize = 6)', async () => {
  // 1. Create an aspiration ticket and a complaint ticket
  const createdAsp = await createTicket({
    type: 'dapil',
    reporterNik: '6305011122330001',
    reporterName: 'Pelapor Aspirasi Test',
    reporterPhone: '081234500001',
    reporterAddress: 'Jl. Brigjend H. Hasan Basry',
    kabupaten: 'KABUPATEN TAPIN',
    kecamatan: 'Tapin Utara',
    kelurahan: 'Rantau Kiwa (Kelurahan)',
    alamatLokasi: 'RT 01 RW 01',
    latitude: -2.935,
    longitude: 115.151,
    title: 'Perbaikan Drainase Test',
    description: 'Usulan perbaikan saluran air di jalan lingkungan warga.',
    dapilId: 'DAPIL-TAPIN-1',
    kamusUsulan: 'Perbaikan Drainase & Saluran Lingkungan',
  });
  createdTicketIds.push(createdAsp.id);
  createdTicketNumbers.push(createdAsp.ticketNumber);

  const createdAdu = await createTicket({
    type: 'masyarakat',
    reporterNik: '6305011122330002',
    reporterName: 'Pelapor Aduan Test',
    reporterPhone: '081234500002',
    reporterAddress: 'Jl. Ahmad Yani',
    kabupaten: 'KABUPATEN TAPIN',
    kecamatan: 'Binuang',
    kelurahan: 'Binuang (Kelurahan)',
    alamatLokasi: 'Simpang Pasar Binuang',
    latitude: -3.079,
    longitude: 115.195,
    title: 'Lampu Jalan Mati Test',
    description: 'Lampu penerangan jalan padam sejak beberapa malam terakhir.',
    agency: 'Komisi III DPRD (Pembangunan, Jalan & Lingkungan Hidup)',
    category: 'Infrastruktur',
  });
  createdTicketIds.push(createdAdu.id);
  createdTicketNumbers.push(createdAdu.ticketNumber);

  // Set createdAt 6 hours earlier & resolve ADU so SLA hours are verifiable
  const sixHoursAgo = new Date(Date.now() - 6 * 3600 * 1000);
  await db.update(tickets).set({ createdAt: sixHoursAgo }).where(eq(tickets.id, createdAdu.id));
  const updatedAdu = await updateTicketStatus(
    createdAdu.ticketNumber,
    'selesai',
    'Telah ditindaklanjuti di lapangan.'
  );
  assert.ok(updatedAdu);
  assert.equal(updatedAdu.status, 'selesai');
  assert.ok(updatedAdu.resolvedAt);

  // Re-opening must clear resolvedAt
  const reopenedAdu = await updateTicketStatus(
    createdAdu.ticketNumber,
    'sedang_diproses',
    'Cek ulang'
  );
  assert.equal(reopenedAdu?.resolvedAt, null);
  await updateTicketStatus(createdAdu.ticketNumber, 'selesai', 'Selesai kembali');

  // 2. Filter getDashboardTickets by type
  const aspList = await getDashboardTickets({ type: 'dapil' });
  assert.ok(aspList.some((item) => item.ticketNumber === createdAsp.ticketNumber));
  assert.equal(
    aspList.some((item) => item.ticketNumber === createdAdu.ticketNumber),
    false
  );
  assert.equal(
    aspList.find((item) => item.ticketNumber === createdAsp.ticketNumber)?.maskedNik,
    '630501******0001'
  );

  const aduList = await getDashboardTickets({ type: 'masyarakat' });
  assert.ok(aduList.some((item) => item.ticketNumber === createdAdu.ticketNumber));
  assert.equal(
    aduList.some((item) => item.ticketNumber === createdAsp.ticketNumber),
    false
  );

  // 3. Submit 7 feedbacks across the 2 tickets to verify default pageSize = 6 pagination
  for (let i = 1; i <= 7; i++) {
    await submitTicketSatisfaction(
      i % 2 === 0 ? createdAsp.ticketNumber : createdAdu.ticketNumber,
      {
        rating: i === 1 ? 3 : 5,
        aspects: ['Formulir Mudah Dipahami'],
        feedback: `Ulasan uji paginasi ke-${i}`,
      },
      i <= 4 ? 'submission' : 'resolution'
    );
  }

  // 4. Verify getAdminTicketDetail & type mismatch protection
  const detailAsp = await getAdminTicketDetail(createdAsp.ticketNumber, 'dapil');
  assert.ok(detailAsp);
  assert.equal(detailAsp.ticketNumber, createdAsp.ticketNumber);
  assert.equal(detailAsp.reporter.nik, '6305011122330001');
  assert.ok(detailAsp.feedbacks.length >= 3);

  const mismatchedDetail = await getAdminTicketDetail(createdAdu.ticketNumber, 'dapil');
  assert.equal(mismatchedDetail, null);

  // 5. Verify getPaginatedCsatReviews(page, 6)
  const page1 = await getPaginatedCsatReviews(1, 6);
  assert.equal(page1.pageSize, 6);
  assert.equal(page1.currentPage, 1);
  assert.equal(page1.items.length, 6);
  assert.ok(page1.totalItems >= 7);
  assert.ok(page1.totalPages >= 2);

  const page2 = await getPaginatedCsatReviews(2, 6);
  assert.equal(page2.currentPage, 2);
  assert.ok(page2.items.length >= 1 && page2.items.length <= 6);

  // Out-of-bounds clamping
  const overflowPage = await getPaginatedCsatReviews(9999, 6);
  assert.equal(overflowPage.currentPage, overflowPage.totalPages);
  const underflowPage = await getPaginatedCsatReviews(-3, 6);
  assert.equal(underflowPage.currentPage, 1);

  // 6. Verify real overview aggregations & CSAT percentage
  const stats = await getDashboardOverviewStats();
  assert.ok(stats.totalTickets >= 2);
  assert.ok(stats.totalAspirations >= 1);
  assert.ok(stats.totalComplaints >= 1);
  assert.ok(stats.completedCount >= 1);
  assert.ok(stats.averageResponseHours !== null && stats.averageResponseHours >= 0);
  assert.ok(stats.kecamatanDistribution.length > 0);
  assert.ok(stats.recentTickets.length > 0 && stats.recentTickets.length <= 5);
  assert.ok(stats.highlightedFeedback !== null);

  const csat = await getCsatAnalytics();
  assert.ok(csat.satisfactionPercentage >= 0 && csat.satisfactionPercentage <= 100);
});
