import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('POST /api/vans - Request body:', body);

    const {
      registrationNumber,
      licensePlateNumber,
      makeAndModel,
      seatingCapacity,
      acCondition,
      startTime,
      endTime,
      studentRating,
      privateRating,
      rBookBase64,
      revenueLicenseBase64,
      fitnessCertificateBase64,
      insuranceCertificateBase64,
      photoBase64,
      ownerId,
    } = body;

    if (
      !registrationNumber || !licensePlateNumber || !makeAndModel ||
      seatingCapacity === undefined || acCondition === undefined ||
      !rBookBase64 || !revenueLicenseBase64 || !fitnessCertificateBase64 ||
      !insuranceCertificateBase64 || !photoBase64 || !ownerId
    ) {
      console.log('Missing required fields:', {
        registrationNumber: !!registrationNumber,
        licensePlateNumber: !!licensePlateNumber,
        makeAndModel: !!makeAndModel,
        seatingCapacity: seatingCapacity !== undefined,
        acCondition: acCondition !== undefined,
        rBookBase64: !!rBookBase64,
        revenueLicenseBase64: !!revenueLicenseBase64,
        fitnessCertificateBase64: !!fitnessCertificateBase64,
        insuranceCertificateBase64: !!insuranceCertificateBase64,
        photoBase64: !!photoBase64,
        ownerId: !!ownerId,
      });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if registration number already exists
    console.log('Checking if registration number exists:', registrationNumber);
    const existingVan = await prisma.van.findUnique({
      where: { registrationNumber }
    });

    if (existingVan) {
      return NextResponse.json({ 
        error: 'Registration number already exists',
        details: 'A van with this registration number is already registered in the system.'
      }, { status: 409 });
    }

    console.log('Starting cloudinary uploads...');
    const uploads = await Promise.all([
      cloudinary.uploader.upload(rBookBase64, { folder: 'vans/rbook' }),
      cloudinary.uploader.upload(revenueLicenseBase64, { folder: 'vans/revenue' }),
      cloudinary.uploader.upload(fitnessCertificateBase64, { folder: 'vans/fitness' }),
      cloudinary.uploader.upload(insuranceCertificateBase64, { folder: 'vans/insurance' }),
      cloudinary.uploader.upload(photoBase64, { folder: 'vans/photo' }),
    ]);
    console.log('Cloudinary uploads completed');

    // Helper function to parse time strings to DateTime
    function parseTimeToDateTime(timeString: string): Date {
      try {
        console.log('Parsing time string:', timeString);
        
        // If it's already a valid date string, use it
        if (timeString.includes('T') || (timeString.includes(':') && timeString.length > 8)) {
          return new Date(timeString);
        }
        
        // Parse time formats like "7:30 am" or "13:30"
        const today = new Date();
        const timeMatch = timeString.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/i);
        
        if (timeMatch) {
          let hours = parseInt(timeMatch[1]);
          const minutes = parseInt(timeMatch[2]);
          const ampm = timeMatch[3]?.toLowerCase();
          
          if (ampm === 'pm' && hours !== 12) {
            hours += 12;
          } else if (ampm === 'am' && hours === 12) {
            hours = 0;
          }
          
          today.setHours(hours, minutes, 0, 0);
          console.log('Parsed time:', today);
          return today;
        }
        
        // Fallback: try to parse as-is
        return new Date(timeString);
      } catch (error) {
        console.error('Error parsing time:', timeString, error);
        // Return current time as fallback
        return new Date();
      }
    }

    const vanData = {
      registrationNumber,
      licensePlateNumber,
      makeAndModel,
      seatingCapacity: parseInt(seatingCapacity),
      acCondition: Boolean(acCondition),
      startTime: startTime ? parseTimeToDateTime(startTime) : null,
      endTime: endTime ? parseTimeToDateTime(endTime) : null,
      studentRating: parseFloat(studentRating) || 0,
      privateRating: parseFloat(privateRating) || 0,
      rBookUrl: uploads[0].secure_url,
      revenueLicenseUrl: uploads[1].secure_url,
      fitnessCertificateUrl: uploads[2].secure_url,
      insuranceCertificateUrl: uploads[3].secure_url,
      photoUrl: uploads[4].secure_url,
      ownerId
    };

    console.log('Creating van with data:', vanData);
    
    const newVan = await prisma.van.create({
      data: vanData,
    });

    console.log('Van created successfully:', newVan);
    return NextResponse.json(newVan, { status: 201 });
  } catch (error) {
    console.error('[CREATE VAN ERROR]', error);
    
    // Handle Prisma-specific errors
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // Handle unique constraint violations
      if (error.message.includes('Unique constraint failed on the fields: (`registrationNumber`)')) {
        return NextResponse.json({ 
          error: 'Registration number already exists',
          details: 'A van with this registration number is already registered in the system.'
        }, { status: 409 });
      }
      
      // Handle other database constraint errors
      if (error.message.includes('Unique constraint failed')) {
        return NextResponse.json({ 
          error: 'Duplicate entry',
          details: 'One or more fields must be unique and already exist in the system.'
        }, { status: 409 });
      }
      
      // Handle foreign key constraint errors
      if (error.message.includes('Foreign key constraint failed')) {
        return NextResponse.json({ 
          error: 'Invalid reference',
          details: 'Referenced data does not exist.'
        }, { status: 400 });
      }
    }
    
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
