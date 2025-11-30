import { getServerSession } from 'next-auth';
// Ganti impor lama
import { authOptions } from '@/lib/auth'; // <-- Import dari lokasi baru
import { NextResponse } from 'next/server';

export const revalidate = 0;

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify({ authenticated: false }), {
      status: 401,
    });
  }

  return NextResponse.json({
    authenticated: !!session,
  });
}