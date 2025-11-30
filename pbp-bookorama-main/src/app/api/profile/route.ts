import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const revalidate = 0;

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { status: 'error', message: 'Unauthorized' },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      name: true,
      email: true,
      role: true,
    },
  });

  return NextResponse.json({
    data: user,
    status: 'success',
  });
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  const body = await request.json();

  if (!session?.user?.email) {
    return NextResponse.json(
      { status: 'error', message: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        name: body.name,
      },
    });

    return NextResponse.json({
      data: updatedUser,
      status: 'success',
      message: 'Profil berhasil diperbarui',
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Gagal memperbarui profil' },
      { status: 500 }
    );
  }
}