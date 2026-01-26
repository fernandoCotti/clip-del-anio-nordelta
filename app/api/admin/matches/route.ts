import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const tournamentId = searchParams.get('tournamentId');
  const round = searchParams.get('round');

  if (!tournamentId || !round) {
    return NextResponse.json(
      { error: 'tournamentId and round are required' },
      { status: 400 }
    );
  }

  const matches = await prisma.match.findMany({
    where: {
      tournamentId,
      round: parseInt(round),
    },
    include: {
      videos: {
        include: {
          video: true,
        },
      },
    },
    orderBy: {
      matchNumber: 'asc',
    },
  });

  return NextResponse.json(matches);
}
