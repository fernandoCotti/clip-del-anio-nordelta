import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const currentMatchId = searchParams.get('currentMatchId');
    const roundParam = searchParams.get('round');

    // Get session ID from cookie
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('sessionId')?.value;

    // Find active tournament
    const tournament = await prisma.tournament.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    if (!tournament) {
      return NextResponse.json({ nextMatchId: null });
    }

    // Determine which round to use
    let targetRound = tournament.currentRound;
    
    // If round is provided in params, use it
    if (roundParam) {
      const roundNum = parseInt(roundParam);
      if (!isNaN(roundNum)) {
        targetRound = roundNum;
      }
    } else if (currentMatchId) {
      // Otherwise, get round from current match
      const currentMatch = await prisma.match.findUnique({
        where: { id: currentMatchId },
        select: { round: true },
      });
      if (currentMatch) {
        targetRound = currentMatch.round;
      }
    }

    // Get all open matches in the target round
    const openMatches = await prisma.match.findMany({
      where: {
        tournamentId: tournament.id,
        round: targetRound,
        isOpen: true,
      },
      orderBy: {
        matchNumber: 'asc',
      },
    });

    if (openMatches.length === 0) {
      return NextResponse.json({ nextMatchId: null });
    }

    // If we have a session, find matches user hasn't voted on
    if (sessionId) {
      const userVotes = await prisma.vote.findMany({
        where: {
          sessionId,
          matchId: {
            in: openMatches.map(m => m.id),
          },
        },
        select: {
          matchId: true,
        },
      });

      const votedMatchIds = new Set(userVotes.map(v => v.matchId));
      
      // Find next match user hasn't voted on (after current match if provided)
      let foundCurrent = !currentMatchId;
      for (const match of openMatches) {
        if (currentMatchId && match.id === currentMatchId) {
          foundCurrent = true;
          continue;
        }
        if (foundCurrent && !votedMatchIds.has(match.id)) {
          return NextResponse.json({ nextMatchId: match.id });
        }
      }

      // If we didn't find one after current, check from beginning
      for (const match of openMatches) {
        if (!votedMatchIds.has(match.id)) {
          return NextResponse.json({ nextMatchId: match.id });
        }
      }

      // All matches voted, no next match
      return NextResponse.json({ nextMatchId: null, allVoted: true });
    }

    // No session, just return the first open match that's not current
    const nextMatch = openMatches.find(m => m.id !== currentMatchId) || openMatches[0];
    return NextResponse.json({ nextMatchId: nextMatch?.id || null });

  } catch (error) {
    console.error('Error finding next match:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
