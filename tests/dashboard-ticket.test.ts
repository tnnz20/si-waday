import 'dotenv/config';
import { and, count, eq, inArray } from 'drizzle-orm';
import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizeKecamatanName } from '../app/constants/admin-data';
import { ALL_DAPIL_LIST, DAPIL_DISTRICTS_MAP, KECAMATAN_TAPIN_LIST } from '../app/constants/tapin';
import { db } from '../app/db/index.server';
import { auditLogs, regions, tickets, userProfiles, users } from '../app/db/schema/schema';
import { signAccessToken } from '../app/lib/auth.server';
import { resolveRegionIdByName } from '../app/lib/region.server';
import { ACCESS_COOKIE_NAME } from '../app/lib/session.server';
import {
  createTicket,
  getAdminTicketDetail,
  getCsatAnalytics,
  getDashboardOverviewStats,
  getDashboardTickets,
  getPaginatedCsatReviews,
  handleTicketStatusUpdateAction,
  resolveDapilName,
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

test('normalizeKecamatanName maps case variants to canonical Tapin district spelling', () => {
  assert.equal(normalizeKecamatanName('TAPIN UTARA'), 'Tapin Utara');
  assert.equal(normalizeKecamatanName('  binuang '), 'Binuang');
  assert.equal(normalizeKecamatanName('Wilayah Khusus'), 'Wilayah Khusus');
});

test('resolveDapilName resolves Tapin DPRD and DPR RI Kalsel 1 codes safely', () => {
  assert.equal(resolveDapilName('DAPIL-KALSEL-1'), 'Dapil Kalimantan Selatan I');
  assert.equal(resolveDapilName(' dapil-kalsel-1 '), 'Dapil Kalimantan Selatan I');
  assert.equal(resolveDapilName('kalsel-1'), 'Dapil Kalimantan Selatan I');
  assert.equal(resolveDapilName('DAPIL-1'), 'Dapil Tapin 1');
  assert.equal(resolveDapilName('DAPIL-TAPIN-2'), 'Dapil Tapin 2');
  assert.equal(resolveDapilName('DAPIL-KALSEL-1', 'Dapil Custom DB'), 'Dapil Custom DB');
  assert.equal(resolveDapilName(null), null);
  assert.equal(resolveDapilName('   '), null);
});

test('master Tapin districts and Dapil constants include all 12 districts and Dapil Kalimantan Selatan I', () => {
  assert.equal(KECAMATAN_TAPIN_LIST.length, 12);
  assert.deepEqual(DAPIL_DISTRICTS_MAP['DAPIL-KALSEL-1'], KECAMATAN_TAPIN_LIST);
  assert.equal(
    ALL_DAPIL_LIST.some(
      (d) => d.id === 'DAPIL-KALSEL-1' && d.name === 'Dapil Kalimantan Selatan I'
    ),
    true
  );
});

test('dashboard queries, RBAC fail-closed moderator scope, resolvedAt preservation, no-op guard, and scoped CSAT', async () => {
  // Look up existing admin and dprd user accounts for real RBAC testing
  const [adminRow] = await db
    .select({
      id: users.id,
      email: users.email,
      fullName: userProfiles.fullName,
    })
    .from(users)
    .innerJoin(userProfiles, eq(userProfiles.userId, users.id))
    .where(eq(users.role, 'admin'))
    .limit(1);
  assert.ok(adminRow, 'Seeded admin user must exist');

  const [dprdRow] = await db
    .select({
      userId: users.id,
      email: users.email,
      fullName: userProfiles.fullName,
      regionId: userProfiles.regionId,
      profileId: userProfiles.id,
    })
    .from(users)
    .innerJoin(userProfiles, eq(userProfiles.userId, users.id))
    .where(eq(users.role, 'dprd'))
    .limit(1);
  assert.ok(dprdRow, 'Seeded dprd user must exist');

  // 1. Create aspiration (case-variant kecamatan), assigned DPRD aspiration, and complaint
  const createdAsp = await createTicket({
    type: 'dapil',
    reporterNik: '6305011122330001',
    reporterName: 'Pelapor Aspirasi Test',
    reporterPhone: '081234500001',
    reporterAddress: 'Jl. Brigjend H. Hasan Basry',
    kabupaten: 'KABUPATEN TAPIN',
    kecamatan: 'TAPIN UTARA',
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

  const createdScopedAsp = await createTicket({
    type: 'dapil',
    reporterNik: '6305011122330003',
    reporterName: 'Konstituen Dewan Test',
    reporterPhone: '081234500003',
    reporterAddress: 'Jl. Kesehatan Rantau',
    kabupaten: 'KABUPATEN TAPIN',
    kecamatan: 'Tapin Utara',
    kelurahan: 'Kupang (Kelurahan)',
    alamatLokasi: 'RT 02',
    latitude: -2.936,
    longitude: 115.152,
    title: 'Usulan Khusus Anggota Dewan',
    description: 'Pengadaan pompa irigasi pertanian kelompok tani.',
    representativeId: dprdRow.profileId,
    dapilId: 'DAPIL-TAPIN-1',
    kamusUsulan: 'Pembangunan Sumur Bor & Jaringan Irigasi Usaha Tani',
  });
  createdTicketIds.push(createdScopedAsp.id);
  createdTicketNumbers.push(createdScopedAsp.ticketNumber);

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

  // 2. Test resolvedAt behavior across reopen, re-resolve, note-only update, and no-op submit
  const sixHoursAgo = new Date(Date.now() - 6 * 3600 * 1000);
  await db.update(tickets).set({ createdAt: sixHoursAgo }).where(eq(tickets.id, createdAdu.id));

  const resolvedAdu = await updateTicketStatus(
    createdAdu.ticketNumber,
    'selesai',
    'Telah ditindaklanjuti di lapangan.'
  );
  assert.ok(resolvedAdu?.resolvedAt);

  // Re-opening must clear resolvedAt
  const reopenedAdu = await updateTicketStatus(
    createdAdu.ticketNumber,
    'sedang_diproses',
    'Cek ulang'
  );
  assert.equal(reopenedAdu?.resolvedAt, null);

  // Resolve back and backdate resolvedAt by 2 hours
  await updateTicketStatus(createdAdu.ticketNumber, 'selesai', 'Selesai kembali');
  const originalResolvedAt = new Date(Date.now() - 2 * 3600 * 1000);
  await db
    .update(tickets)
    .set({ resolvedAt: originalResolvedAt })
    .where(eq(tickets.id, createdAdu.id));

  // Admin edits ONLY adminNotes on already-resolved ticket -> resolvedAt must remain unchanged
  const adminToken = await signAccessToken({
    id: adminRow.id,
    email: adminRow.email,
    role: 'admin',
    fullName: adminRow.fullName,
    avatarUrl: null,
    regionId: null,
  });

  const noteUpdateForm = new FormData();
  noteUpdateForm.append('status', 'selesai');
  noteUpdateForm.append('adminNotes', 'Catatan berita acara diperbarui.');
  const noteUpdateReq = new Request(
    `http://localhost/dashboard/complaints/${createdAdu.ticketNumber}`,
    {
      method: 'POST',
      body: noteUpdateForm,
      headers: { Cookie: `${ACCESS_COOKIE_NAME}=${adminToken}` },
    }
  );
  const noteUpdateRes = await handleTicketStatusUpdateAction(
    noteUpdateReq,
    createdAdu.ticketNumber,
    'masyarakat'
  );
  assert.equal(noteUpdateRes.status, 200);

  const [afterNoteUpdate] = await db
    .select({ resolvedAt: tickets.resolvedAt })
    .from(tickets)
    .where(eq(tickets.id, createdAdu.id));
  assert.equal(afterNoteUpdate.resolvedAt?.getTime(), originalResolvedAt.getTime());

  // Identical no-op submit must NOT write a redundant audit log entry
  const [{ auditCountBeforeNoop }] = await db
    .select({ auditCountBeforeNoop: count() })
    .from(auditLogs)
    .where(
      and(eq(auditLogs.entityType, 'ticket'), eq(auditLogs.entityId, createdAdu.ticketNumber))
    );

  const noopForm = new FormData();
  noopForm.append('status', 'selesai');
  noopForm.append('adminNotes', 'Catatan berita acara diperbarui.');
  const noopReq = new Request(`http://localhost/dashboard/complaints/${createdAdu.ticketNumber}`, {
    method: 'POST',
    body: noopForm,
    headers: { Cookie: `${ACCESS_COOKIE_NAME}=${adminToken}` },
  });
  const noopRes = await handleTicketStatusUpdateAction(
    noopReq,
    createdAdu.ticketNumber,
    'masyarakat'
  );
  assert.equal(noopRes.status, 200);

  const [{ auditCountAfterNoop }] = await db
    .select({ auditCountAfterNoop: count() })
    .from(auditLogs)
    .where(
      and(eq(auditLogs.entityType, 'ticket'), eq(auditLogs.entityId, createdAdu.ticketNumber))
    );
  assert.equal(auditCountAfterNoop, auditCountBeforeNoop);

  // 3. Moderator without valid regionId MUST fail closed (0 tickets, null detail)
  const modWithoutRegion = {
    id: 'mod-no-region',
    email: 'mod-null@tapinkab.go.id',
    role: 'moderator' as const,
    fullName: 'Moderator Tanpa Wilayah',
    avatarUrl: null,
    regionId: null,
  };
  assert.deepEqual(await getDashboardTickets({ type: 'dapil', user: modWithoutRegion }), []);
  assert.equal(
    await getAdminTicketDetail(createdAsp.ticketNumber, 'dapil', modWithoutRegion),
    null
  );
  const modNullStats = await getDashboardOverviewStats(modWithoutRegion);
  assert.equal(modNullStats.totalTickets, 0);
  assert.equal(modNullStats.csat.totalReviews, 0);

  const modInvalidRegion = {
    ...modWithoutRegion,
    regionId: '00000000-0000-0000-0000-000000000000',
  };
  assert.deepEqual(await getDashboardTickets({ type: 'dapil', user: modInvalidRegion }), []);

  // Moderator WITH valid Dapil 1 region only sees DAPIL-TAPIN-1 tickets
  const dapil1RegionId = await resolveRegionIdByName('Dapil Tapin 1');
  assert.ok(dapil1RegionId, 'Dapil Tapin 1 region must exist');
  assert.equal(await resolveRegionIdByName('Dapil Fiktif Tidak Ada'), null);
  const modDapil1 = { ...modWithoutRegion, regionId: dapil1RegionId };
  const modDapil1Tickets = await getDashboardTickets({ type: 'dapil', user: modDapil1 });
  assert.ok(modDapil1Tickets.some((t) => t.ticketNumber === createdAsp.ticketNumber));
  assert.ok(modDapil1Tickets.every((t) => t.dapilId === 'DAPIL-TAPIN-1'));

  // 4. Filter getDashboardTickets by type & verify canonical kecamatan normalization
  const aspList = await getDashboardTickets({ type: 'dapil' });
  const aspItem = aspList.find((item) => item.ticketNumber === createdAsp.ticketNumber);
  assert.ok(aspItem);
  assert.equal(aspItem.kecamatan, 'Tapin Utara');
  assert.equal(aspItem.maskedNik, '630501******0001');
  assert.equal(
    aspList.some((item) => item.ticketNumber === createdAdu.ticketNumber),
    false
  );

  // 5. Submit 7 feedbacks (1 on scoped DPRD ticket, 6 across createdAsp & createdAdu)
  await submitTicketSatisfaction(
    createdScopedAsp.ticketNumber,
    {
      rating: 5,
      aspects: ['Formulir Mudah Dipahami'],
      feedback: 'Ulasan khusus untuk anggota DPRD',
    },
    'submission'
  );
  for (let i = 1; i <= 6; i++) {
    await submitTicketSatisfaction(
      i % 2 === 0 ? createdAsp.ticketNumber : createdAdu.ticketNumber,
      {
        rating: i === 1 ? 3 : 5,
        aspects: ['Formulir Mudah Dipahami'],
        feedback: `Ulasan uji paginasi ke-${i}`,
      },
      i <= 3 ? 'submission' : 'resolution'
    );
  }

  // Verify scoped Overview CSAT aligns strictly with DPRD user's assigned tickets
  const dprdUser = {
    id: dprdRow.userId,
    email: dprdRow.email,
    role: 'dprd' as const,
    fullName: dprdRow.fullName,
    avatarUrl: null,
    regionId: dprdRow.regionId,
  };
  const globalStats = await getDashboardOverviewStats();
  const dprdStats = await getDashboardOverviewStats(dprdUser);
  assert.ok(dprdStats.csat.totalReviews < globalStats.csat.totalReviews);
  assert.ok(dprdStats.csat.totalReviews >= 1);

  // Verify Option B: DPRD member can update their OWN assigned aspiration
  const dprdToken = await signAccessToken(dprdUser);
  const dprdUpdateForm = new FormData();
  dprdUpdateForm.append('status', 'sedang_diproses');
  dprdUpdateForm.append('adminNotes', 'Ditindaklanjuti oleh anggota dewan dapil.');
  const dprdRes = await handleTicketStatusUpdateAction(
    new Request(`http://localhost/dashboard/aspirations/${createdScopedAsp.ticketNumber}`, {
      method: 'POST',
      body: dprdUpdateForm,
      headers: { Cookie: `${ACCESS_COOKIE_NAME}=${dprdToken}` },
    }),
    createdScopedAsp.ticketNumber,
    'dapil'
  );
  assert.equal(dprdRes.status, 200);

  // 6. Verify detail lookup, paginated CSAT (pageSize = 6), and global overview stats
  const detailAsp = await getAdminTicketDetail(createdAsp.ticketNumber, 'dapil');
  assert.ok(detailAsp);
  assert.equal(detailAsp.reporter.nik, '6305011122330001');
  assert.ok(detailAsp.feedbacks.length >= 3);
  assert.equal(await getAdminTicketDetail(createdAdu.ticketNumber, 'dapil'), null);

  const page1 = await getPaginatedCsatReviews(1, 6);
  assert.equal(page1.pageSize, 6);
  assert.equal(page1.currentPage, 1);
  assert.equal(page1.items.length, 6);
  assert.ok(page1.totalItems >= 7);
  assert.ok(page1.totalPages >= 2);

  const overflowPage = await getPaginatedCsatReviews(9999, 6);
  assert.equal(overflowPage.currentPage, overflowPage.totalPages);

  assert.ok(globalStats.totalTickets >= 3);
  assert.equal(
    globalStats.kecamatanDistribution.filter((d) => d.name.toLowerCase() === 'tapin utara')
      .length <= 1,
    true
  );

  const csat = await getCsatAnalytics();
  assert.ok(csat.satisfactionPercentage >= 0 && csat.satisfactionPercentage <= 100);
  // Ensure regions import stays clean
  const [rCheck] = await db.select({ id: regions.id }).from(regions).limit(1);
  assert.ok(rCheck.id);
});
