import { and, eq } from 'drizzle-orm';

import { ticketFeedbacks, tickets, userProfiles, users } from '../app/db/schema/schema';
import { type ScriptDb, getScriptDb } from './db';

export async function seedTickets(context?: ScriptDb) {
  const ownContext = !context ? await getScriptDb() : null;
  const db = context?.db || ownContext!.db;

  try {
    console.log('📋 Seeding sample citizen tickets and multi-stage feedbacks...');

    // 1. Get existing DPRD representatives for foreign keys
    const dprdMembers = await db
      .select({
        id: userProfiles.id,
        fullName: userProfiles.fullName,
        regionId: userProfiles.regionId,
      })
      .from(userProfiles)
      .innerJoin(users, eq(users.id, userProfiles.userId))
      .where(eq(users.role, 'dprd'))
      .limit(5);

    // 2. Get an admin/moderator user for assigned staff
    const [staff] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.role, 'admin'))
      .limit(1);

    const staffId = staff?.id || null;
    const rep1 = dprdMembers[0]?.id || null;
    const rep2 = dprdMembers[1]?.id || null;

    const sampleTicketData = [
      // --- Aspirasi Pokir Dapil (type: dapil) ---
      {
        ticket: {
          ticketNumber: 'ASP-2026-1001',
          type: 'dapil' as const,
          reporterNik: '6305011203850001',
          reporterName: 'H. Muhammad Arsyad',
          reporterPhone: '081250112233',
          reporterEmail: 'arsyad.tapin@gmail.com',
          reporterAddress: 'Jl. Brigjend H. Hasan Basry No. 45, Rantau',
          idCardUrl: '/uploads/avatars/sample-ktp.jpg',
          kabupaten: 'KABUPATEN TAPIN',
          kecamatan: 'Tapin Utara',
          kelurahan: 'Rantau Kiwa (Kelurahan)',
          alamatLokasi: 'RT 04 RW 02, Dekat Masjid Nurul Falah',
          latitude: -2.9362,
          longitude: 115.1511,
          title: 'Bantuan Pembangunan Sumur Bor Pertanian',
          description:
            'Pengusulan pembuatan fasilitas sumur bor dan pompa air tenaga surya untuk kelompok tani cabai rawit Hiyung guna mengantisipasi musim kemarau panjang.',
          representativeId: rep1,
          dapilId: 'DAPIL-TAPIN-1',
          kamusUsulan: 'Pembangunan Sumur Bor & Jaringan Irigasi Usaha Tani',
          agency: null,
          category: null,
          photos: ['/uploads/photos/sample-well-1.jpg'],
          documentUrl: 'proposal-sumur-bor-rt04.pdf',
          status: 'selesai' as const,
          adminNotes:
            'Usulan telah diakomodasi dalam RKPD Tahun Anggaran 2026 melalui Pokir Komisi II.',
          assignedToUserId: staffId,
        },
        feedbacks: [
          {
            type: 'submission' as const,
            rating: 5,
            aspects: ['Formulir Mudah Dipahami', 'Tampilan Rapi & Jelas'],
            feedback: 'Formulir online sangat mudah diisi dan langsung terkonfirmasi.',
          },
          {
            type: 'resolution' as const,
            rating: 5,
            aspects: ['Kecepatan Akses Lancar', 'Transparansi Alur Aduan'],
            feedback:
              'Alhamdulillah aspirasi sumur bor warga kami cepat ditanggapi dan diakomodasi oleh dewan.',
          },
        ],
      },
      {
        ticket: {
          ticketNumber: 'ASP-2026-1002',
          type: 'dapil' as const,
          reporterNik: '6305022108900004',
          reporterName: 'Siti Aminah',
          reporterPhone: '085248991122',
          reporterEmail: 'siti.aminah@yahoo.com',
          reporterAddress: 'Desa Salam Babaris RT 03',
          idCardUrl: null,
          kabupaten: 'KABUPATEN TAPIN',
          kecamatan: 'Salam Babaris',
          kelurahan: 'Salam Babaris',
          alamatLokasi: 'Jalan Usaha Tani Blok B',
          latitude: -3.0125,
          longitude: 115.2214,
          title: 'Perbaikan Rumah Tidak Layak Huni (RTLH)',
          description:
            'Pengajuan bantuan perbaikan 3 unit rumah lansia dan prasejahtera yang mengalami kerusakan berat pada atap dan lantai kayu.',
          representativeId: rep2,
          dapilId: 'DAPIL-TAPIN-2',
          kamusUsulan: 'Bantuan Stimulan Perumahan Swadaya / RTLH',
          agency: null,
          category: null,
          photos: ['/uploads/photos/rtlh-1.jpg', '/uploads/photos/rtlh-2.jpg'],
          documentUrl: 'surat-rekomendasi-desa.pdf',
          status: 'sedang_diproses' as const,
          adminNotes: 'Sedang dalam tahap verifikasi lapangan bersama Dinas Perkim Tapin.',
          assignedToUserId: staffId,
        },
        feedbacks: [
          {
            type: 'submission' as const,
            rating: 4,
            aspects: ['Tampilan Rapi & Jelas'],
            feedback: 'Semoga segera cair dan diperbaiki sebelum musim hujan.',
          },
        ],
      },
      {
        ticket: {
          ticketNumber: 'ASP-2026-1003',
          type: 'dapil' as const,
          reporterNik: '6305030507880002',
          reporterName: 'Bahruddin',
          reporterPhone: '081349002211',
          reporterEmail: null,
          reporterAddress: 'Binuang Pasar Lama',
          idCardUrl: null,
          kabupaten: 'KABUPATEN TAPIN',
          kecamatan: 'Binuang',
          kelurahan: 'Binuang (Kelurahan)',
          alamatLokasi: 'Gang Melati RT 05',
          latitude: -3.0789,
          longitude: 115.1952,
          title: 'Penerangan Jalan Umum Tenaga Surya (PJU-TS)',
          description:
            'Pemasangan lampu penerangan jalan di sepanjang gang pemukiman padat warga yang masih gelap gulita saat malam hari guna mencegah kerawanan kamtibmas.',
          representativeId: rep2,
          dapilId: 'DAPIL-TAPIN-2',
          kamusUsulan: 'Pemasangan Lampu Penerangan Jalan Umum (PJU)',
          agency: null,
          category: null,
          photos: [],
          documentUrl: null,
          status: 'menunggu_verifikasi' as const,
          adminNotes: null,
          assignedToUserId: null,
        },
        feedbacks: [
          {
            type: 'submission' as const,
            rating: 5,
            aspects: ['Formulir Mudah Dipahami'],
            feedback: 'Sangat praktis bisa langsung titip usulan ke dewan Dapil.',
          },
        ],
      },

      // --- Aduan Pengawasan Masyarakat (type: masyarakat) ---
      {
        ticket: {
          ticketNumber: 'ADU-2026-2001',
          type: 'masyarakat' as const,
          reporterNik: '6305011504920003',
          reporterName: 'Ahmad Fauzi',
          reporterPhone: '087815663344',
          reporterEmail: 'fauzi.tapin@gmail.com',
          reporterAddress: 'Jl. Penghulu Suhaimi No. 18, Rantau Kanan',
          idCardUrl: null,
          kabupaten: 'KABUPATEN TAPIN',
          kecamatan: 'Tapin Utara',
          kelurahan: 'Rantau Kanan (Kelurahan)',
          alamatLokasi: 'Jembatan Sungai Tapin ruas Rantau Kanan',
          latitude: -2.9341,
          longitude: 115.1555,
          title: 'Pagar Pengaman Jembatan Ambruk dan Membahayakan Pengendara',
          description:
            'Besi pembatas pagar pengaman jembatan penyeberangan patah akibat tersenggol kendaraan muatan berat dua hari lalu. Lokasi minim penerangan dan rawan kecelakaan fatal bagi pengendara roda dua.',
          representativeId: null,
          dapilId: null,
          kamusUsulan: null,
          agency: 'Komisi III DPRD (Pembangunan & Infrastruktur)',
          category: 'Infrastruktur',
          photos: ['/uploads/photos/jembatan-rusak-1.jpg'],
          documentUrl: null,
          status: 'sedang_diproses' as const,
          adminNotes:
            'DPRD Komisi III telah menjadwalkan sidak lapangan dan memanggil Dinas PUPR Tapin untuk perbaikan darurat.',
          assignedToUserId: staffId,
        },
        feedbacks: [
          {
            type: 'submission' as const,
            rating: 5,
            aspects: ['Kecepatan Akses Lancar', 'Transparansi Alur Aduan'],
            feedback: 'Luar biasa cepat diteruskan ke Komisi 3 DPRD.',
          },
        ],
      },
      {
        ticket: {
          ticketNumber: 'ADU-2026-2002',
          type: 'masyarakat' as const,
          reporterNik: '6305041011860002',
          reporterName: 'Rusmilawati',
          reporterPhone: '085390114455',
          reporterEmail: 'rusmila@gmail.com',
          reporterAddress: 'Desa Bitahan RT 02',
          idCardUrl: null,
          kabupaten: 'KABUPATEN TAPIN',
          kecamatan: 'Lokpaikat',
          kelurahan: 'Bitahan',
          alamatLokasi: 'Puskesmas Pembantu Bitahan',
          latitude: -2.9056,
          longitude: 115.1782,
          title: 'Kekosongan Tenaga Medis dan Obat-Obatan di Pustu',
          description:
            'Pustu sering tutup lebih awal sebelum jam 11 siang dan stok obat demam anak sering kosong selama dua pekan terakhir, warga terpaksa menempuh jarak jauh ke Rantau.',
          representativeId: null,
          dapilId: null,
          kamusUsulan: null,
          agency: 'Komisi II DPRD (Kesehatan & Kesra)',
          category: 'Pelayanan Publik',
          photos: [],
          documentUrl: null,
          status: 'terverifikasi' as const,
          adminNotes:
            'Aduan telah diverifikasi memenuhi syarat formil dan diteruskan ke Sekretariat Komisi II.',
          assignedToUserId: staffId,
        },
        feedbacks: [
          {
            type: 'submission' as const,
            rating: 4,
            aspects: ['Formulir Mudah Dipahami'],
            feedback: 'Semoga segera ada tindak lanjut untuk pelayanan puskesmas pembantu.',
          },
        ],
      },
      {
        ticket: {
          ticketNumber: 'ADU-2026-2003',
          type: 'masyarakat' as const,
          reporterNik: '6305051906950005',
          reporterName: 'Dedi Irawan',
          reporterPhone: '082155447788',
          reporterEmail: null,
          reporterAddress: 'Bakarangan RT 01',
          idCardUrl: null,
          kabupaten: 'KABUPATEN TAPIN',
          kecamatan: 'Bakarangan',
          kelurahan: 'Bakarangan',
          alamatLokasi: 'Tempat Pembuangan Sementara Pasar Bakarangan',
          latitude: -2.9125,
          longitude: 115.1245,
          title: 'Penumpukan Sampah Liar Meluber ke Bahu Jalan',
          description:
            'Bak kontainer sampah over kapasitas dan armada pengangkut terlambat lebih dari 4 hari, menimbulkan bau menyengat serta mengganggu aktivitas perdagangan warga.',
          representativeId: null,
          dapilId: null,
          kamusUsulan: null,
          agency: 'Komisi III DPRD (Pembangunan & Infrastruktur)',
          category: 'Kebersihan & Lingkungan',
          photos: ['/uploads/photos/sampah-1.jpg'],
          documentUrl: null,
          status: 'selesai' as const,
          adminNotes:
            'Dinas Lingkungan Hidup Tapin telah membersihkan lokasi dan menambah armada kontainer.',
          assignedToUserId: staffId,
        },
        feedbacks: [
          {
            type: 'submission' as const,
            rating: 5,
            aspects: ['Formulir Mudah Dipahami'],
            feedback: 'Alur pelaporan aduan masyarakat sangat jelas.',
          },
          {
            type: 'resolution' as const,
            rating: 5,
            aspects: ['Kecepatan Akses Lancar', 'Transparansi Alur Aduan'],
            feedback: 'Sampah sudah diangkut bersih, terima kasih tim dewan dan dinas LH.',
          },
        ],
      },
    ];

    for (const item of sampleTicketData) {
      const t = item.ticket;
      const [existing] = await db
        .select({ id: tickets.id })
        .from(tickets)
        .where(eq(tickets.ticketNumber, t.ticketNumber))
        .limit(1);

      let ticketId: string;
      if (existing) {
        await db
          .update(tickets)
          .set({ ...t, updatedAt: new Date() })
          .where(eq(tickets.id, existing.id));
        ticketId = existing.id;
        console.log(`  🔄 Updated ticket: ${t.ticketNumber} (${t.type})`);
      } else {
        const [inserted] = await db.insert(tickets).values(t).returning({ id: tickets.id });
        ticketId = inserted.id;
        console.log(`  ✨ Inserted ticket: ${t.ticketNumber} (${t.type})`);
      }

      // Seed multi-stage feedbacks
      for (const fb of item.feedbacks) {
        const [existingFb] = await db
          .select({ id: ticketFeedbacks.id })
          .from(ticketFeedbacks)
          .where(and(eq(ticketFeedbacks.ticketId, ticketId), eq(ticketFeedbacks.type, fb.type)))
          .limit(1);

        if (existingFb) {
          await db
            .update(ticketFeedbacks)
            .set({
              rating: fb.rating,
              aspects: fb.aspects,
              feedback: fb.feedback,
            })
            .where(eq(ticketFeedbacks.id, existingFb.id));
          console.log(`    🔄 Updated feedback: ${fb.type} (rating: ${fb.rating})`);
        } else {
          await db.insert(ticketFeedbacks).values({
            ticketId,
            type: fb.type,
            rating: fb.rating,
            aspects: fb.aspects,
            feedback: fb.feedback,
          });
          console.log(`    ✨ Inserted feedback: ${fb.type} (rating: ${fb.rating})`);
        }
      }
    }

    console.log('✅ Tickets & feedbacks seeding completed successfully!');
  } catch (error) {
    console.error('❌ Failed to seed tickets:', error);
    throw error;
  } finally {
    if (ownContext) {
      await ownContext.close();
    }
  }
}

if (process.argv[1]?.includes('seed-tickets')) {
  seedTickets()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
