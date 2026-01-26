import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { getRoundSize } from '@/lib/utils';

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { tournamentId, round } = body;

    if (!tournamentId || !round) {
      return NextResponse.json(
        { error: 'tournamentId and round are required' },
        { status: 400 }
      );
    }

    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
    });

    if (!tournament) {
      return NextResponse.json(
        { error: 'Tournament not found' },
        { status: 404 }
      );
    }

    const roundSize = getRoundSize(round);
    if (roundSize === 0) {
      return NextResponse.json(
        { error: 'Invalid round' },
        { status: 400 }
      );
    }

    // For round 1, get all videos
    if (round === 1) {
      const videos = await prisma.video.findMany({
        where: { tournamentId },
        orderBy: { createdAt: 'asc' },
      });

      if (videos.length !== 64) {
        return NextResponse.json(
          { error: `Tournament must have exactly 64 videos. Found ${videos.length}` },
          { status: 400 }
        );
      }

      // Create matches for round 1
      const matches = [];
      for (let i = 0; i < 32; i++) {
        const match = await prisma.match.create({
          data: {
            tournamentId,
            round: 1,
            matchNumber: i + 1,
            isOpen: false,
            isComplete: false,
            videos: {
              create: [
                {
                  videoId: videos[i * 2].id,
                  position: 0,
                },
                {
                  videoId: videos[i * 2 + 1].id,
                  position: 1,
                },
              ],
            },
          },
        });
        matches.push(match);
      }

      return NextResponse.json({ success: true, matches });
    }

    // For subsequent rounds, get winners from previous round
    const previousRound = round - 1;
    const previousMatches = await prisma.match.findMany({
      where: {
        tournamentId,
        round: previousRound,
        isComplete: true,
      },
      include: {
        videos: true,
      },
      orderBy: {
        matchNumber: 'asc',
      },
    });

    // The number of winners from previous round should equal the number of videos in current round
    // which is also equal to roundSize
    const expectedPreviousMatches = roundSize;
    if (previousMatches.length !== expectedPreviousMatches) {
      return NextResponse.json(
        { error: `Previous round must be complete. Found ${previousMatches.length} completed matches, expected ${expectedPreviousMatches}` },
        { status: 400 }
      );
    }

    const winners = previousMatches
      .map(m => m.winnerId)
      .filter((id): id is string => id !== null);

    if (winners.length !== roundSize) {
      return NextResponse.json(
        { error: 'Not all previous matches have winners' },
        { status: 400 }
      );
    }

    // Create matches for current round
    // Number of matches = roundSize / 2 (since each match has 2 videos)
    const numMatches = roundSize / 2;
    const matches = [];
    for (let i = 0; i < numMatches; i++) {
      const match = await prisma.match.create({
        data: {
          tournamentId,
          round,
          matchNumber: i + 1,
          isOpen: false,
          isComplete: false,
          videos: {
            create: [
              {
                videoId: winners[i * 2],
                position: 0,
              },
              {
                videoId: winners[i * 2 + 1],
                position: 1,
              },
            ],
          },
        },
      });
      matches.push(match);
    }

    return NextResponse.json({ success: true, matches });
  } catch (error) {
    console.error('Error generating matches:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
