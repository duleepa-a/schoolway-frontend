import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const vanOwnerId = session.user.id;
    const { searchParams } = new URL(req.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    // Build date filter
    let dateFilter: any = {};
    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0);
      dateFilter.createdAt = {
        gte: startDate,
        lte: endDate
      };
    }

    // Get all payments for this van owner's vans
    const payments = await prisma.payment.findMany({
      where: {
        vanServiceId: vanOwnerId,
        status: 'PAID',
        ...dateFilter
      },
      include: {
        Van: {
          select: {
            id: true,
            makeAndModel: true,
            licensePlateNumber: true,
            registrationNumber: true
          }
        },
        Child: {
          select: {
            id: true,
            name: true,
            grade: true
          }
        },
        UserProfile: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true
          }
        }
      },
      orderBy: {
        paidAt: 'desc'
      }
    });

    // Calculate total revenue
    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);

    // Group payments by van
    const revenueByVan = payments.reduce((acc, payment) => {
      const vanId = payment.vanId;
      if (!acc[vanId]) {
        acc[vanId] = {
          van: payment.Van,
          totalRevenue: 0,
          paymentCount: 0,
          payments: []
        };
      }
      acc[vanId].totalRevenue += payment.amount;
      acc[vanId].paymentCount += 1;
      acc[vanId].payments.push(payment);
      return acc;
    }, {} as any);

    // Get monthly revenue data for the last 12 months
    const monthlyRevenue = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthPayments = await prisma.payment.findMany({
        where: {
          vanServiceId: vanOwnerId,
          status: 'PAID',
          createdAt: {
            gte: monthStart,
            lte: monthEnd
          }
        }
      });
      
      const monthRevenue = monthPayments.reduce((sum, payment) => sum + payment.amount, 0);
      
      monthlyRevenue.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        revenue: monthRevenue,
        paymentCount: monthPayments.length
      });
    }

    // Get van owner's vans for additional context
    const vans = await prisma.van.findMany({
      where: {
        ownerId: vanOwnerId
      },
      select: {
        id: true,
        makeAndModel: true,
        licensePlateNumber: true,
        registrationNumber: true,
        status: true
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue,
        totalPayments: payments.length,
        revenueByVan: Object.values(revenueByVan),
        monthlyRevenue,
        vans,
        payments: payments.slice(0, 50) // Limit to recent 50 payments for table
      }
    });

  } catch (error) {
    console.error('Error fetching van owner revenue:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
