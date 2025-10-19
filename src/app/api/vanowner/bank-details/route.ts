import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // adjust path based on your project
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    // Extract userId from query string if provided
    const url = new URL(req.url);
    const userIdParam = url.searchParams.get('userId');
    
    const session = await getServerSession(authOptions);
    console.log('[GET_BANK_DETAILS] Session user:', session?.user?.id);
    console.log('[GET_BANK_DETAILS] Query param userId:', userIdParam);
    
    // Determine which user ID to use
    const userIdToUse = userIdParam || session?.user?.id;
    
    if (!userIdToUse) {
      console.error('[GET_BANK_DETAILS_ERROR] No user ID available');
      return NextResponse.json({ message: 'Unauthorized - No user ID available' }, { status: 401 });
    }
    
    console.log('[GET_BANK_DETAILS] Looking up bank details for user:', userIdToUse);
    
    const vanService = await prisma.vanService.findUnique({
      where: { userId: userIdToUse },
      select: {
        accountNo: true,
        bank: true,
        branch: true,
      },
    });

    if (!vanService) {
      console.log('[GET_BANK_DETAILS] No van service found for user:', userIdToUse);
      return NextResponse.json({ 
        message: 'No bank details found',
        accountNumber: '',
        bankName: '',
        branch: ''
      }, { status: 200 }); // Return empty values with 200 status instead of 404
    }
    
    console.log('[GET_BANK_DETAILS] Found bank details:', {
      accountNumber: vanService.accountNo,
      bankName: vanService.bank,
      branch: vanService.branch
    });

    return NextResponse.json({
      accountNumber: vanService.accountNo || '',
      bankName: vanService.bank || '',
      branch: vanService.branch || '',
    });
  } catch (error) {
    console.error('[GET_BANK_DETAILS_ERROR]', error);
    return NextResponse.json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}


export async function PATCH(req: Request) {
  try {
    // Parse the request body first, with error handling
    let body;
    try {
      body = await req.json();
      console.log('[BANK_DETAILS_RECEIVED] Raw payload:', JSON.stringify(body));
    } catch (parseError) {
      console.error('[BANK_DETAILS_ERROR] Failed to parse request body:', parseError);
      return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
    }
    
    const { accountNumber, bankName, branch, userId } = body;
    
    // Validate required fields
    if (!accountNumber || !bankName || !branch) {
      console.error('[BANK_DETAILS_ERROR] Missing required fields in payload');
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Session check with more detailed logging
    const session = await getServerSession(authOptions);
    console.log('[BANK_DETAILS_AUTH] Session user:', session?.user?.id);
    
    if (!session?.user?.id && !userId) {
      console.error('[BANK_DETAILS_ERROR] No authentication: No session user ID and no userId provided');
      return NextResponse.json({ message: 'Unauthorized - No user identification available' }, { status: 401 });
    }

    // Use the provided userId if available, otherwise use the session user id
    const userIdToUse = userId || session?.user?.id;
    
    // Log the userId being used and the payload for debugging
    console.log('[BANK_DETAILS_UPDATE] Using UserID:', userIdToUse);
    console.log('[BANK_DETAILS_UPDATE] Processing payload:', { accountNumber, bankName, branch });

    // First check if user exists
    try {
      const user = await prisma.userProfile.findUnique({
        where: { id: userIdToUse },
      });
      
      if (!user) {
        console.error('[BANK_DETAILS_ERROR] User not found:', userIdToUse);
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }
      
      console.log('[BANK_DETAILS_UPDATE] User found:', user.id);
    } catch (userError) {
      console.error('[BANK_DETAILS_ERROR] Error checking user:', userError);
      return NextResponse.json({ 
        message: 'Error checking user',
        error: userError instanceof Error ? userError.message : 'Unknown error'
      }, { status: 500 });
    }
    
    // Check if VanService exists for this user
    let vanService;
    try {
      vanService = await prisma.vanService.findUnique({
        where: { userId: userIdToUse },
      });
      
      if (!vanService) {
        console.error('[BANK_DETAILS_ERROR] Van service not found for user:', userIdToUse);
        return NextResponse.json({ message: 'Van service not found for this user' }, { status: 404 });
      }
      
      console.log('[BANK_DETAILS_UPDATE] Van service found:', vanService.id);
    } catch (vanServiceError) {
      console.error('[BANK_DETAILS_ERROR] Error checking van service:', vanServiceError);
      return NextResponse.json({ 
        message: 'Error checking van service',
        error: vanServiceError instanceof Error ? vanServiceError.message : 'Unknown error'
      }, { status: 500 });
    }

    // Update the VanService with the bank details
    let updated;
    try {
      console.log('[BANK_DETAILS_UPDATE] Attempting to update van service for user:', userIdToUse);
      console.log('[BANK_DETAILS_UPDATE] Update data:', {
        accountNo: accountNumber,
        bank: bankName,
        branch,
      });
      
      updated = await prisma.vanService.update({
        where: { userId: userIdToUse },
        data: {
          accountNo: accountNumber,
          bank: bankName,
          branch,
        },
      });
      
      console.log('[BANK_DETAILS_SUCCESS] Updated bank details for user:', userIdToUse);
      console.log('[BANK_DETAILS_SUCCESS] Updated data:', {
        accountNo: updated.accountNo,
        bank: updated.bank,
        branch: updated.branch
      });
      
      return NextResponse.json({ 
        message: 'Bank details updated successfully',
        accountNumber: updated.accountNo,
        bankName: updated.bank,
        branch: updated.branch
      });
    } catch (updateError) {
      console.error('[BANK_DETAILS_ERROR] Failed to update bank details:', updateError);
      return NextResponse.json({ 
        message: 'Failed to update bank details',
        error: updateError instanceof Error ? updateError.message : 'Unknown error' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('[PATCH_BANK_DETAILS_ERROR]', error);
    
    // Return more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      message: 'Failed to update bank details', 
      error: errorMessage 
    }, { status: 500 });
  }
}
