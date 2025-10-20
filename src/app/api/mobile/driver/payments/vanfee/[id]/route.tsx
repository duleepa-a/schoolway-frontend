// for van service fee retrieval for each child :

// response may look like this 
// {
//     "summary": [
//         {
//             "recipientId": "user123",
//             "payrollStatus": "COMPLETED",
//             "_sum": {
//                 "amount": 25000.00
//             }
//         }
//     ],
//     "monthlyBreakdown": [
//         {
//             "month": "2023-10",
//             "totalAmount": 5000.00,
//             "payments": [
//                 {
//                     "id": 1,
//                     "amount": 2500.00,
//                     "payrollStatus": "COMPLETED",
//                     "createdAt": "2023-10-15T...",
//                     "Payment": {
//                         "month": "2023-10",
//                         "status": "PAID",
//                         "amount": 10000.00,
//                         "Child": {
//                             "name": "John Doe"
//                         }
//                     }
//                 }
//                 // ... more payments
//             ]
//         }
//         // ... more months
//     ]
// }

import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

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

        // Get monthly salary summaries
        const monthlySalaries = await prisma.payroll.groupBy({
            by: [
                'recipientId',
                'payrollStatus'
            ],
            where: {
                recipientId: userId,
            },
            _sum: {
                amount: true
            },
            orderBy: {
                _sum: {
                    amount: 'desc'
                }
            }
        });

        // Get detailed payment information
        const paymentDetails = await prisma.payroll.findMany({
            where: {
                recipientId: userId
            },
            select: {
                id: true,
                amount: true,
                payrollStatus: true,
                createdAt: true,
                Payment: {
                    select: {
                        month: true,
                        status: true,
                        amount: true,
                        Child: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Group payments by month
        const monthlyPayments = paymentDetails.reduce((acc, payment) => {
            const month = payment.Payment.month;
            if (!acc[month]) {
                acc[month] = {
                    month: month,
                    totalAmount: 0,
                    payments: []
                };
            }
            acc[month].totalAmount += payment.amount;
            acc[month].payments.push(payment);
            return acc;
        }, {});

        return NextResponse.json({
            summary: monthlySalaries,
            monthlyBreakdown: Object.values(monthlyPayments)
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching salary details:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}