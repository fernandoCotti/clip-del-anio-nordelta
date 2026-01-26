import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const tournamentId = searchParams.get('tournamentId');

  if (!tournamentId) {
    return NextResponse.json(
      { error: 'tournamentId is required' },
      { status: 400 }
    );
  }

  const videos = await prisma.video.findMany({
    where: { tournamentId },
    orderBy: { createdAt: 'asc' },
  });

  return NextResponse.json(videos);
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { tournamentId, title, embedUrl } = body;

    if (!tournamentId || !title || !embedUrl) {
      return NextResponse.json(
        { error: 'tournamentId, title, and embedUrl are required' },
        { status: 400 }
      );
    }

    const video = await prisma.video.create({
      data: {
        tournamentId,
        title,
        embedUrl,
      },
    });

    return NextResponse.json(video);
  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
