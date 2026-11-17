import { getScriptDb } from './db';
import { seedAdmin } from './seed-admin';
import { seedModerators } from './seed-moderators';
import { seedRepresentatives } from './seed-representatives';

async function runMasterSeed() {
  console.log('🚀 Starting full database seeding...\n');
  const scriptDb = await getScriptDb();

  try {
    // 1. Seed regions and council representatives
    await seedRepresentatives(scriptDb);
    console.log('');

    // 2. Seed super admin from .env
    await seedAdmin(scriptDb);
    console.log('');

    // 3. Seed sample moderators for regional testing
    await seedModerators(scriptDb);
    console.log('');

    console.log('🎉 All seeders executed successfully!');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  } finally {
    await scriptDb.close();
  }
}

runMasterSeed();
