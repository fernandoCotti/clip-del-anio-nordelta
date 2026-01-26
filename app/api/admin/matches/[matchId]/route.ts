import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { matchId } = await params;
    const body = await request.json();

    // If closing a match, determine winner
    if (body.isOpen === false && body.isComplete !== true) {
      const match = await prisma.match.findUnique({
        where: { id: matchId },
        include: {
          votes: true,
        },
      });

      if (match) {
        const voteCounts = await prisma.vote.groupBy({
          by: ['videoId'],
          where: {
            matchId,
          },
          _count: {
            videoId: true,
          },
        });

        if (voteCounts.length > 0) {
          const winner = voteCounts.reduce((prev, current) =>
            prev._count.videoId > current._count.videoId ? prev : current
          );

          body.winnerId = winner.videoId;
          body.isComplete = true;
        }
      }
    }

    const match = await prisma.match.update({
      where: { id: matchId },
      data: body,
    });

    return NextResponse.json(match);
  } catch (error) {
    console.error('Error updating match:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
