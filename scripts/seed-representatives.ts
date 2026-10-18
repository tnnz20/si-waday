import { eq } from 'drizzle-orm';

import { regions, userProfiles, users } from '../app/db/schema/schema';
import { hashPassword } from '../app/lib/auth.server';
import { getScriptDb } from './db';

const REGIONS_DATA = [
  {
    name: 'Dapil Tapin 1',
    code: 'DAPIL-TAPIN-1',
    type: 'dapil_dprd' as const,
    description: 'Kecamatan Tapin Utara, Bungur, Lokpaikat, Piani (7 Kursi DPRD)',
  },
  {
    name: 'Dapil Tapin 2',
    code: 'DAPIL-TAPIN-2',
    type: 'dapil_dprd' as const,
    description: 'Kecamatan Tapin Selatan, Salam Babaris, Binuang, Hatungun (10 Kursi DPRD)',
  },
  {
    name: 'Dapil Tapin 3',
    code: 'DAPIL-TAPIN-3',
    type: 'dapil_dprd' as const,
    description:
      'Kecamatan Candi Laras Utara, Candi Laras Selatan, Tapin Tengah, Bakarangan (8 Kursi DPRD)',
  },
  {
    name: 'Dapil Kalimantan Selatan I',
    code: 'DAPIL-KALSEL-1',
    type: 'dapil_dpr' as const,
    description:
      'Dapil DPR RI Kalimantan Selatan I meliputi Kabupaten Tapin, Banjar, Barito Kuala, HSS, HST, HSU, Tabalong, Balangan (6 Kursi)',
  },
  {
    name: 'Kabupaten Tapin',
    code: 'KAB-TAPIN',
    type: 'kabupaten' as const,
    description: 'Wilayah Administratif Pemerintahan Kabupaten Tapin',
  },
];

// All 25 DPRD Tapin members
const DPRD_TAPIN_MEMBERS = [
  // Dapil 1
  {
    name: 'H. Daritaniansyah',
    party: 'Partai Golkar',
    dapilCode: 'DAPIL-TAPIN-1',
    commission: 'Komisi I (Pemerintahan & Hukum)',
    gender: 'male' as const,
  },
  {
    name: 'H. Midpay Syahbani',
    party: 'PDI Perjuangan',
    dapilCode: 'DAPIL-TAPIN-1',
    commission: 'Komisi III (Pembangunan & Infrastruktur)',
    gender: 'male' as const,
  },
  {
    name: 'H. Hairuji',
    party: 'Partai Gerindra',
    dapilCode: 'DAPIL-TAPIN-1',
    commission: 'Komisi II (Ekonomi & Keuangan)',
    gender: 'male' as const,
  },
  {
    name: 'Rakhmat Hidayat',
    party: 'Partai NasDem',
    dapilCode: 'DAPIL-TAPIN-1',
    commission: 'Komisi I (Pemerintahan & Hukum)',
    gender: 'male' as const,
  },
  {
    name: 'H. Muhammad Baseri',
    party: 'Partai PKB',
    dapilCode: 'DAPIL-TAPIN-1',
    commission: 'Komisi II (Ekonomi & Keuangan)',
    gender: 'male' as const,
  },
  {
    name: 'Ismail',
    party: 'Partai Demokrat',
    dapilCode: 'DAPIL-TAPIN-1',
    commission: 'Komisi III (Pembangunan & Infrastruktur)',
    gender: 'male' as const,
  },
  {
    name: 'H. Rustan Nawawi',
    party: 'Partai Golkar',
    dapilCode: 'DAPIL-TAPIN-1',
    commission: 'Komisi I (Pemerintahan & Hukum)',
    gender: 'male' as const,
  },

  // Dapil 2
  {
    name: 'Achmad Riduansyah',
    party: 'Partai Golkar',
    dapilCode: 'DAPIL-TAPIN-2',
    commission: 'Komisi I (Pemerintahan & Hukum)',
    gender: 'male' as const,
  },
  {
    name: 'Taufik Hidayat',
    party: 'Partai Golkar',
    dapilCode: 'DAPIL-TAPIN-2',
    commission: 'Komisi III (Pembangunan & Infrastruktur)',
    gender: 'male' as const,
  },
  {
    name: 'Rahman Nor Wahyudi',
    party: 'Partai Gerindra',
    dapilCode: 'DAPIL-TAPIN-2',
    commission: 'Komisi II (Ekonomi & Keuangan)',
    gender: 'male' as const,
  },
  {
    name: 'H. Misran',
    party: 'Partai Golkar',
    dapilCode: 'DAPIL-TAPIN-2',
    commission: 'Komisi III (Pembangunan & Infrastruktur)',
    gender: 'male' as const,
  },
  {
    name: "M. Tegar Mi'radinata",
    party: 'Partai Golkar',
    dapilCode: 'DAPIL-TAPIN-2',
    commission: 'Komisi II (Ekonomi & Keuangan)',
    gender: 'male' as const,
  },
  {
    name: 'Fatmawati',
    party: 'Partai Golkar',
    dapilCode: 'DAPIL-TAPIN-2',
    commission: 'Komisi I (Pemerintahan & Hukum)',
    gender: 'female' as const,
  },
  {
    name: 'Wahyu Nugroho Ranoro',
    party: 'PDI Perjuangan',
    dapilCode: 'DAPIL-TAPIN-2',
    commission: 'Komisi III (Pembangunan & Infrastruktur)',
    gender: 'male' as const,
  },
  {
    name: 'H. Mislan',
    party: 'Partai Golkar',
    dapilCode: 'DAPIL-TAPIN-2',
    commission: 'Komisi II (Ekonomi & Keuangan)',
    gender: 'male' as const,
  },
  {
    name: 'H. Yamar Hadi',
    party: 'Partai NasDem',
    dapilCode: 'DAPIL-TAPIN-2',
    commission: 'Komisi I (Pemerintahan & Hukum)',
    gender: 'male' as const,
  },
  {
    name: 'H. Rajudin Noor',
    party: 'Partai Golkar',
    dapilCode: 'DAPIL-TAPIN-2',
    commission: 'Komisi III (Pembangunan & Infrastruktur)',
    gender: 'male' as const,
  },

  // Dapil 3
  {
    name: 'Dedy Arief Budiman',
    party: 'Partai Golkar',
    dapilCode: 'DAPIL-TAPIN-3',
    commission: 'Komisi I (Pemerintahan & Hukum)',
    gender: 'male' as const,
  },
  {
    name: 'H. Gilang Firdaus Helmi',
    party: 'Partai PKS',
    dapilCode: 'DAPIL-TAPIN-3',
    commission: 'Komisi II (Ekonomi & Keuangan)',
    gender: 'male' as const,
  },
  {
    name: 'Yuspianor',
    party: 'PDI Perjuangan',
    dapilCode: 'DAPIL-TAPIN-3',
    commission: 'Komisi III (Pembangunan & Infrastruktur)',
    gender: 'male' as const,
  },
  {
    name: 'M. Fajri Rahman',
    party: 'Partai Gerindra',
    dapilCode: 'DAPIL-TAPIN-3',
    commission: 'Komisi I (Pemerintahan & Hukum)',
    gender: 'male' as const,
  },
  {
    name: 'Herni Mustika',
    party: 'Partai PKB',
    dapilCode: 'DAPIL-TAPIN-3',
    commission: 'Komisi II (Ekonomi & Keuangan)',
    gender: 'female' as const,
  },
  {
    name: 'Ahmad Syarnobi',
    party: 'Partai PAN',
    dapilCode: 'DAPIL-TAPIN-3',
    commission: 'Komisi III (Pembangunan & Infrastruktur)',
    gender: 'male' as const,
  },
  {
    name: 'H. Ihwanudin',
    party: 'Partai PPP',
    dapilCode: 'DAPIL-TAPIN-3',
    commission: 'Komisi I (Pemerintahan & Hukum)',
    gender: 'male' as const,
  },
  {
    name: 'Robby Apriandie',
    party: 'Partai Demokrat',
    dapilCode: 'DAPIL-TAPIN-3',
    commission: 'Komisi III (Pembangunan & Infrastruktur)',
    gender: 'male' as const,
  },
];

// DPR RI Representatives (Dapil Kalsel 1)
const DPR_RI_MEMBERS = [
  {
    name: 'Bambang Heri Purnama',
    party: 'Partai Golkar',
    dapilCode: 'DAPIL-KALSEL-1',
    commission: 'Komisi VI (Perdagangan & BUMN)',
    gender: 'male' as const,
  },
  {
    name: 'Sandi Fitrian Noor',
    party: 'Partai Golkar',
    dapilCode: 'DAPIL-KALSEL-1',
    commission: 'Komisi IV (Pertanian & Kelautan)',
    gender: 'male' as const,
  },
  {
    name: 'Rifqinizamy Karsayuda',
    party: 'Partai NasDem',
    dapilCode: 'DAPIL-KALSEL-1',
    commission: 'Komisi II (Pemerintahan & Hukum)',
    gender: 'male' as const,
  },
  {
    name: 'Habib Aboe Bakar Al-Habsyi',
    party: 'Partai PKS',
    dapilCode: 'DAPIL-KALSEL-1',
    commission: 'Komisi III (Hukum & Keamanan)',
    gender: 'male' as const,
  },
  {
    name: 'Muhammad Rano Alfath',
    party: 'Partai PKB',
    dapilCode: 'DAPIL-KALSEL-1',
    commission: 'Komisi III (Hukum & Keamanan)',
    gender: 'male' as const,
  },
  {
    name: 'H. Endang Agustina',
    party: 'Partai PAN',
    dapilCode: 'DAPIL-KALSEL-1',
    commission: 'Komisi V (Infrastruktur & Perhubungan)',
    gender: 'male' as const,
  },
];

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export async function seedRepresentatives() {
  const { db, client } = getScriptDb();

  try {
    console.log('🏛️ Seeding Regions (Wilayah)...');
    const regionIdMap = new Map<string, string>();

    for (const regionData of REGIONS_DATA) {
      const [existing] = await db
        .select()
        .from(regions)
        .where(eq(regions.code, regionData.code))
        .limit(1);

      if (existing) {
        await db
          .update(regions)
          .set({
            name: regionData.name,
            type: regionData.type,
            description: regionData.description,
            updatedAt: new Date(),
          })
          .where(eq(regions.id, existing.id));
        regionIdMap.set(regionData.code, existing.id);
      } else {
        const [inserted] = await db
          .insert(regions)
          .values({
            name: regionData.name,
            code: regionData.code,
            type: regionData.type,
            description: regionData.description,
          })
          .returning({ id: regions.id });
        regionIdMap.set(regionData.code, inserted.id);
      }
    }
    console.log(`✅ Seeded ${REGIONS_DATA.length} regions.`);

    // Password for all seeded representatives
    const defaultPasswordHash = hashPassword('Dewan2026!');

    // Seed DPRD members
    console.log('👥 Seeding DPRD Kabupaten Tapin members...');
    for (const member of DPRD_TAPIN_MEMBERS) {
      const slug = generateSlug(member.name);
      const email = `${slug}@dprd.tapinkab.go.id`;
      const regionId = regionIdMap.get(member.dapilCode);

      const [existingUser] = await db.select().from(users).where(eq(users.email, email)).limit(1);

      let userId: string;

      if (existingUser) {
        userId = existingUser.id;
        await db
          .update(users)
          .set({ role: 'dprd', isActive: true, updatedAt: new Date() })
          .where(eq(users.id, userId));
      } else {
        const [newUser] = await db
          .insert(users)
          .values({
            email,
            passwordHash: defaultPasswordHash,
            role: 'dprd',
            isActive: true,
          })
          .returning({ id: users.id });
        userId = newUser.id;
      }

      const [existingProfile] = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, userId))
        .limit(1);

      if (existingProfile) {
        await db
          .update(userProfiles)
          .set({
            fullName: member.name,
            slug,
            gender: member.gender,
            avatarUrl: null, // Default photo first
            regionId,
            party: member.party,
            commission: member.commission,
            updatedAt: new Date(),
          })
          .where(eq(userProfiles.id, existingProfile.id));
      } else {
        await db.insert(userProfiles).values({
          userId,
          fullName: member.name,
          slug,
          gender: member.gender,
          avatarUrl: null, // Default photo first
          regionId,
          party: member.party,
          commission: member.commission,
        });
      }
    }
    console.log(`✅ Seeded ${DPRD_TAPIN_MEMBERS.length} DPRD members.`);

    // Seed DPR RI members
    console.log('👥 Seeding DPR RI (Dapil Kalsel 1) members...');
    for (const member of DPR_RI_MEMBERS) {
      const slug = generateSlug(member.name);
      const email = `${slug}@dpr.go.id`;
      const regionId = regionIdMap.get(member.dapilCode);

      const [existingUser] = await db.select().from(users).where(eq(users.email, email)).limit(1);

      let userId: string;

      if (existingUser) {
        userId = existingUser.id;
        await db
          .update(users)
          .set({ role: 'dpr', isActive: true, updatedAt: new Date() })
          .where(eq(users.id, userId));
      } else {
        const [newUser] = await db
          .insert(users)
          .values({
            email,
            passwordHash: defaultPasswordHash,
            role: 'dpr',
            isActive: true,
          })
          .returning({ id: users.id });
        userId = newUser.id;
      }

      const [existingProfile] = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, userId))
        .limit(1);

      if (existingProfile) {
        await db
          .update(userProfiles)
          .set({
            fullName: member.name,
            slug,
            gender: member.gender,
            avatarUrl: null,
            regionId,
            party: member.party,
            commission: member.commission,
            updatedAt: new Date(),
          })
          .where(eq(userProfiles.id, existingProfile.id));
      } else {
        await db.insert(userProfiles).values({
          userId,
          fullName: member.name,
          slug,
          gender: member.gender,
          avatarUrl: null,
          regionId,
          party: member.party,
          commission: member.commission,
        });
      }
    }
    console.log(`✅ Seeded ${DPR_RI_MEMBERS.length} DPR RI members.`);
  } finally {
    await client.end();
  }
}

// Allow direct execution
if (process.argv[1]?.includes('seed-representatives')) {
  seedRepresentatives()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Failed to seed representatives:', err);
      process.exit(1);
    });
}
