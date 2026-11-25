import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE,
  createAdminSessionToken,
  isAdminAuthenticated,
  verifyAdminPassword,
} from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.ADMIN_PASSWORD) {
      console.error('ADMIN_PASSWORD is not set; admin login is disabled.');
      return NextResponse.json(
        { error: 'Admin login is not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { password } = body;

    if (!verifyAdminPassword(password)) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Set a signed, expiring admin session cookie
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, createAdminSessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: ADMIN_SESSION_MAX_AGE,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    authenticated: await isAdminAuthenticated(),
  });
}
