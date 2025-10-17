
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const userId = await params.id;

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        const bankAccount = await prisma.bankAccount.findUnique({
            where: {
                userId: userId
            },
            select: {
                accountNo: true,
                accountName: true,
                bankName: true,
                branchName: true,
                branchCode: true,
                isVerified: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!bankAccount) {
            return NextResponse.json(
                { message: 'No bank account found for this user' },
                { status: 404 }
            );
        }

        return NextResponse.json(bankAccount, { status: 200 });

    } catch (error) {
        console.error('Error fetching bank account:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const userId = params.id;
        const data = await request.json();

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Validate required fields
        const requiredFields = ['accountNo', 'accountName', 'bankName', 'branchName'];
        for (const field of requiredFields) {
            if (!data[field]) {
                return NextResponse.json(
                    { error: `${field} is required` },
                    { status: 400 }
                );
            }
        }

        // Update or create bank account
        const bankAccount = await prisma.bankAccount.upsert({
            where: {
                userId: userId
            },
            update: {
                accountNo: data.accountNo,
                accountName: data.accountName,
                bankName: data.bankName,
                branchName: data.branchName,
                branchCode: data.branchCode,
                isVerified: false, // Reset verification on update
            },
            create: {
                userId: userId,
                accountNo: data.accountNo,
                accountName: data.accountName,
                bankName: data.bankName,
                branchName: data.branchName,
                branchCode: data.branchCode,
                isVerified: false,
            },
        });

        return NextResponse.json(bankAccount, { status: 200 });

    } catch (error) {
        console.error('Error updating bank account:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

