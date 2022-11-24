import { PrismaClient } from '@prisma/client';
import exerciseTypes from './seed-data/exercise-types.json';

const prisma = new PrismaClient();
async function main() {
  for (const exerciseType of exerciseTypes) {
    await prisma.exerciseType.upsert({
      where: { id: exerciseType.id },
      update: {},
      create: {
        id: exerciseType.id,
        name: exerciseType.name,
      },
    });
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
