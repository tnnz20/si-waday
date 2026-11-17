import { eq } from 'drizzle-orm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { regions, userProfiles, users } from '../app/db/schema/schema';
import { hashPassword } from '../app/lib/auth.server';
import { parseCsv } from './csv';
import { type ScriptDb, getScriptDb } from './db';

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

interface LegislatorMember {
  name: string;
  party: string;
  dapilCode: string;
  commission: string;
  gender: 'male' | 'female';
}

// DPR RI Representatives (Dapil Kalsel 1)
const DPR_RI_MEMBERS: LegislatorMember[] = [
  {
    name: 'Bambang Heri Purnama',
    party: 'Partai Golkar',
    dapilCode: 'DAPIL-KALSEL-1',
    commission: 'Komisi VI (Perdagangan & BUMN)',
    gender: 'male',
  },
  {
    name: 'Sandi Fitrian Noor',
    party: 'Partai Golkar',
    dapilCode: 'DAPIL-KALSEL-1',
    commission: 'Komisi IV (Pertanian & Kelautan)',
    gender: 'male',
  },
  {
    name: 'Rifqinizamy Karsayuda',
    party: 'Partai NasDem',
    dapilCode: 'DAPIL-KALSEL-1',
    commission: 'Komisi II (Pemerintahan & Hukum)',
    gender: 'male',
  },
  {
    name: 'Habib Aboe Bakar Al-Habsyi',
    party: 'Partai PKS',
    dapilCode: 'DAPIL-KALSEL-1',
    commission: 'Komisi III (Hukum & Keamanan)',
    gender: 'male',
  },
  {
    name: 'Muhammad Rano Alfath',
    party: 'Partai PKB',
    dapilCode: 'DAPIL-KALSEL-1',
    commission: 'Komisi III (Hukum & Keamanan)',
    gender: 'male',
  },
  {
    name: 'H. Endang Agustina',
    party: 'Partai PAN',
    dapilCode: 'DAPIL-KALSEL-1',
    commission: 'Komisi V (Infrastruktur & Perhubungan)',
    gender: 'male',
  },
];

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

async function seedLegislators(
  db: ScriptDb['db'],
  members: LegislatorMember[],
  role: 'dprd' | 'dpr',
  emailDomain: string,
  regionIdMap: Map<string, string>,
  defaultPasswordHash: string
) {
  for (const member of members) {
    const slug = generateSlug(member.name);
    const email = `${slug}@${emailDomain}`;
    const regionId = regionIdMap.get(member.dapilCode);

    const [existingUser] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    let userId: string;

    if (existingUser) {
      userId = existingUser.id;
      await db
        .update(users)
        .set({ role, isActive: true, updatedAt: new Date() })
        .where(eq(users.id, userId));
    } else {
      const [newUser] = await db
        .insert(users)
        .values({
          email,
          passwordHash: defaultPasswordHash,
          role,
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
}

export async function seedRepresentatives(context?: ScriptDb) {
  const ownContext = !context ? await getScriptDb() : null;
  const db = context?.db || ownContext!.db;

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
    const dprdMembersCsvPath = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      'data/dprd-tapin-members.csv'
    );
    const dprdTapinMembers = parseCsv<LegislatorMember>(dprdMembersCsvPath);

    await seedLegislators(
      db,
      dprdTapinMembers,
      'dprd',
      'dprd.tapinkab.go.id',
      regionIdMap,
      defaultPasswordHash
    );
    console.log(`✅ Seeded ${dprdTapinMembers.length} DPRD members.`);

    // Seed DPR RI members
    console.log('👥 Seeding DPR RI (Dapil Kalsel 1) members...');
    await seedLegislators(db, DPR_RI_MEMBERS, 'dpr', 'dpr.go.id', regionIdMap, defaultPasswordHash);
    console.log(`✅ Seeded ${DPR_RI_MEMBERS.length} DPR RI members.`);
  } finally {
    if (ownContext) {
      await ownContext.close();
    }
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
