import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';

export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Sudah benar
) {
  const { id } = await params; // Sudah benar
  const categoryId = id;

  const category = await prisma.categories.findUnique({
    where: {
      id: Number(categoryId),
    },
  });

  return NextResponse.json({
    data: category,
    status: 'success',
    message: 'Category fetched successfully',
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Sudah benar
) {
  const { id } = await params; // Sudah benar
  const categoryId = id;

  await prisma.categories.delete({
    where: {
      id: Number(categoryId),
    },
  });

  return NextResponse.json({
    status: 'success',
    message: 'Category deleted successfully',
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Sudah benar
) {
  const { id } = await params; // Sudah benar
  const categoryId = id;
  const req = await request.json();

  try {
    const updatedCategory = await prisma.categories.update({
      where: {
        id: Number(categoryId),
      },
      data: {
        name: req.name,
      },
    });

    return NextResponse.json({
      data: updatedCategory,
      status: 'success',
      message: 'Category updated successfully',
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError)
      return NextResponse.json(
        {
          status: 'error',
          message: `Server sedang mengalami gangguan`,
          fullMessage: e,
        },
        { status: 500 }
      );
  }
}