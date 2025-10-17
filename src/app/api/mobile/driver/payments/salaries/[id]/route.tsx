import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

interface MonthlySummary {
    [key: string]: {
        month: string;
        monthString: string;
        completed: number;
        pending: number;
        total: number;
    }
}

function formatMonthString(date: Date) {
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

function getMonthKey(date: Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const userId = params.id;

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Fetch all payroll entries for the user
        const payrollEntries = await prisma.payroll.findMany({
            where: {
                recipientId: userId,
            },
            select: {
                amount: true,
                payrollStatus: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Group by month using JavaScript
        const formattedSummary = payrollEntries.reduce((acc: MonthlySummary, curr) => {
            const monthKey = getMonthKey(new Date(curr.createdAt));
            
            if (!acc[monthKey]) {
                acc[monthKey] = {
                    month: monthKey,
                    monthString: formatMonthString(new Date(curr.createdAt)),
                    completed: 0,
                    pending: 0,
                    total: 0
                };
            }

            const amount = curr.amount || 0;
            if (curr.payrollStatus === 'COMPLETED') {
                acc[monthKey].completed += amount;
            } else if (curr.payrollStatus === 'PENDING') {
                acc[monthKey].pending += amount;
            }
            acc[monthKey].total += amount;

            return acc;
        }, {});

        // Sort by month in descending order
        const sortedSummary = Object.values(formattedSummary).sort((a, b) => 
            b.month.localeCompare(a.month)
        );

        console.log('Monthly Salary Summary:', sortedSummary);
        
        return NextResponse.json({
            monthlySummary: sortedSummary
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching salary summary:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
