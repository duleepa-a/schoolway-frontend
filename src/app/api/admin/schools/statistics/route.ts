import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Get total schools count
    const totalSchools = await prisma.school.count();

    // Get total guardians count
    const totalGuardians = await prisma.schoolGuardian.count();

    // Get total students count
    const totalStudents = await prisma.child.count();

    // Get total gates count
    const totalGates = await prisma.gate.count();

    // Get active gates count
    const activeGates = await prisma.gate.count({
      where: {
        isActive: true
      }
    });

    // Get inactive gates count
    const inactiveGates = await prisma.gate.count({
      where: {
        isActive: false
      }
    });

    return NextResponse.json({
      totalSchools,
      totalGuardians,
      totalStudents,
      totalGates,
      activeGates,
      inactiveGates
    });

  } catch (error) {
    console.error('Error fetching school statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}