import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { matchId, videoId, sessionId: clientSessionId } = body;

    // Get sessionId from cookie if available, otherwise use client-provided one
    const cookieStore = await cookies();
    const cookieSessionId = cookieStore.get('sessionId')?.value;
    const sessionId = cookieSessionId || clientSessionId;

    if (!matchId || !videoId || !sessionId) {
      console.error('Missing required fields:', { matchId, videoId, sessionId: !!sessionId, cookieSessionId: !!cookieSessionId, clientSessionId: !!clientSessionId });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log(`Vote request: matchId=${matchId}, videoId=${videoId}, sessionId=${sessionId.substring(0, 20)}...`);

    // Verify match exists and is open
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        videos: true,
      },
    });

    if (!match) {
      console.error(`Match not found: ${matchId}`);
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      );
    }

    if (!match.isOpen) {
      console.error(`Match is not open: ${matchId}, isOpen: ${match.isOpen}`);
      return NextResponse.json(
        { error: 'Match is not open for voting' },
        { status: 400 }
      );
    }

    // Verify video is in this match
    const videoInMatch = match.videos.some(v => v.videoId === videoId);
    if (!videoInMatch) {
      console.error(`Video ${videoId} not in match ${matchId}. Match videos:`, match.videos.map(v => v.videoId));
      return NextResponse.json(
        { error: 'Video not in this match' },
        { status: 400 }
      );
    }

    // Check if user already voted
    const existingVote = await prisma.vote.findUnique({
      where: {
        matchId_sessionId: {
          matchId,
          sessionId,
        },
      },
    });

    if (existingVote) {
      return NextResponse.json(
        { error: 'Already voted' },
        { status: 400 }
      );
    }

    // Create vote
    try {
      await prisma.vote.create({
        data: {
          matchId,
          videoId,
          sessionId,
        },
      });
      console.log(`Vote created successfully: matchId=${matchId}, videoId=${videoId}, sessionId=${sessionId.substring(0, 20)}...`);
    } catch (error: any) {
      console.error('Error creating vote:', error);
      if (error.code === 'P2002') {
        // Unique constraint violation - already voted
        return NextResponse.json(
          { error: 'Ya has votado en este partido' },
          { status: 400 }
        );
      }
      throw error;
    }

    // Set session cookie (use the sessionId we used to create the vote)
    cookieStore.set('sessionId', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    // Get updated vote counts
    const voteCounts = await prisma.vote.groupBy({
      by: ['videoId'],
      where: {
        matchId,
      },
      _count: {
        videoId: true,
      },
    });

    const totalVotes = voteCounts.reduce((sum, v) => sum + v._count.videoId, 0);
    const video1Id = match.videos[0].videoId;
    const video2Id = match.videos[1].videoId;
    const video1Votes = voteCounts.find(v => v.videoId === video1Id)?._count.videoId || 0;
    const video2Votes = voteCounts.find(v => v.videoId === video2Id)?._count.videoId || 0;
    const video1Percentage = totalVotes > 0 ? Math.round((video1Votes / totalVotes) * 100) : 0;
    const video2Percentage = totalVotes > 0 ? Math.round((video2Votes / totalVotes) * 100) : 0;

    return NextResponse.json({
      success: true,
      video1Votes,
      video2Votes,
      video1Percentage,
      video2Percentage,
    });
  } catch (error) {
    console.error('Error voting:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
