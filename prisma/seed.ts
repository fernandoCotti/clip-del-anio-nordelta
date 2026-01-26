import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a sample tournament
  const tournament = await prisma.tournament.create({
    data: {
      name: 'Nordelta 2025',
      year: 2025,
      isActive: false,
      currentRound: 1,
    },
  });

  console.log(`Created tournament: ${tournament.name}`);
  console.log('\nTo add videos and start the tournament, use the admin interface at /admin');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
