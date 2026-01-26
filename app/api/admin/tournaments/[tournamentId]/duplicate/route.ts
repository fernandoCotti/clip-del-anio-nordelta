import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tournamentId: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { tournamentId } = await params;
    const body = await request.json();
    const { newName } = body;

    // Get the original tournament with all videos
    const originalTournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        videos: true,
      },
    });

    if (!originalTournament) {
      return NextResponse.json(
        { error: 'Tournament not found' },
        { status: 404 }
      );
    }

    // Create new tournament
    const newTournament = await prisma.tournament.create({
      data: {
        name: newName || `${originalTournament.name} (Copia)`,
        year: originalTournament.year,
        isActive: false,
        currentRound: 1,
      },
    });

    // Duplicate all videos
    const videoMapping: Record<string, string> = {};
    for (const video of originalTournament.videos) {
      const newVideo = await prisma.video.create({
        data: {
          tournamentId: newTournament.id,
          title: video.title,
          embedUrl: video.embedUrl,
        },
      });
      videoMapping[video.id] = newVideo.id;
    }

    return NextResponse.json({
      success: true,
      tournament: newTournament,
      videosCount: originalTournament.videos.length,
    });
  } catch (error) {
    console.error('Error duplicating tournament:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
