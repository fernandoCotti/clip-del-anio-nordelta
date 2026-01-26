import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { WinnerDisplay } from '@/components/WinnerDisplay';

export default async function WinnerPage({
  params,
}: {
  params: Promise<{ videoId: string }>;
}) {
  const { videoId } = await params;

  const video = await prisma.video.findUnique({
    where: { id: videoId },
    include: {
      tournament: true,
    },
  });

  if (!video) {
    notFound();
  }

  const tournamentName = process.env.NEXT_PUBLIC_TOURNAMENT_NAME || video.tournament.name;

  return <WinnerDisplay video={video} tournamentName={tournamentName} />;
}
