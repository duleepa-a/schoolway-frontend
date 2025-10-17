// app/api/mobile/driver/[id]/profile/route.ts
import prisma from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';
import { NextRequest, NextResponse } from 'next/server';

// For Next.js API routes
export const config = {
  api: {
    // Enable the default bodyParser for this approach
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

// Define types for our upload results
interface UploadResult {
  url: string;
  publicId: string;
}

interface UploadResults {
  profileImage?: UploadResult;
  licenseFront?: UploadResult;
  licenseBack?: UploadResult;
  nicImage?: UploadResult;
  policeReport?: UploadResult;
  medicalReport?: UploadResult;
}

interface FormData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string; 
  birthDate?: string;
  nic?: string;
  licenseId?: string;
  licenseExpiry?: string;
  licenseType?: string | string[];
  relocate?: boolean;
  startedDriving?: string;
  languages?: string | string[];
  bio?: string;
  
  // Base64 encoded files
  profileImage?: string;
  licenseFront?: string;
  licenseBack?: string;
  nicPic?: string;
  policeReport?: string;
  medicalReport?: string;
}

// Interfaces and types defined above

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const userId = resolvedParams.id;
    console.log("Getting profile for user:", userId);
    
    const user = await prisma.userProfile.findUnique({
      where: { id: userId },
      include: { 
        DriverProfile: true  // Changed from driverProfile to DriverProfile
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
     
    console.log("Fetched user profile:", user);
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const userId = resolvedParams.id;
    console.log('Processing update for user:', userId);
    
    const data = await req.json() as FormData;
    console.log('Received form data for user update');
    
    // Handle uploads to Cloudinary
    const uploadResults: UploadResults = {};
    
    // Upload profile image if provided
    if (data.profileImage) {
      console.log('Uploading profile image...');
      
      const profileUpload = await cloudinary.uploader.upload(data.profileImage, {
        folder: 'SchoolWay/profile_images',
        resource_type: 'image',
        transformation: [
          { quality: 'auto:good' }
        ]
      });
      
      uploadResults.profileImage = {
        url: profileUpload.secure_url,
        publicId: profileUpload.public_id
      };
      console.log('Profile image uploaded:', profileUpload.secure_url);
    }
    
    // Upload license front if provided
    if (data.licenseFront) {
      console.log('Uploading license front image...');
      
      const frontUpload = await cloudinary.uploader.upload(data.licenseFront, {
        folder: 'SchoolWay/driver_licenses',
        resource_type: 'image',
        transformation: [
          { quality: 'auto:good' }
        ]
      });
      
      uploadResults.licenseFront = {
        url: frontUpload.secure_url,
        publicId: frontUpload.public_id
      };
      console.log('License front uploaded:', frontUpload.secure_url);
    }
    
    // Upload license back if provided
    if (data.licenseBack) {
      console.log('Uploading license back image...');
      
      const backUpload = await cloudinary.uploader.upload(data.licenseBack, {
        folder: 'SchoolWay/driver_licenses',
        resource_type: 'image',
        transformation: [
          { quality: 'auto:good' }
        ]
      });
      
      uploadResults.licenseBack = {
        url: backUpload.secure_url,
        publicId: backUpload.public_id
      };
      console.log('License back uploaded:', backUpload.secure_url);
    }
    
    // Upload NIC image if provided
    if (data.nicPic) {
      console.log('Uploading NIC image...');
      
      const nicUpload = await cloudinary.uploader.upload(data.nicPic, {
        folder: 'SchoolWay/nic_images',
        resource_type: 'image',
        transformation: [
          { quality: 'auto:good' }
        ]
      });
      
      uploadResults.nicImage = {
        url: nicUpload.secure_url,
        publicId: nicUpload.public_id
      };
      console.log('NIC image uploaded:', nicUpload.secure_url);
    }
    
    // Upload police report if provided
    if (data.policeReport) {
      console.log('Uploading police report...');
      
      const reportUpload = await cloudinary.uploader.upload(data.policeReport, {
        folder: 'SchoolWay/documents',
        resource_type: 'auto'
      });
      
      uploadResults.policeReport = {
        url: reportUpload.secure_url,
        publicId: reportUpload.public_id
      };
      console.log('Police report uploaded:', reportUpload.secure_url);
    }
    
    // Upload medical report if provided
    if (data.medicalReport) {
      console.log('Uploading medical report...');
      
      const reportUpload = await cloudinary.uploader.upload(data.medicalReport, {
        folder: 'SchoolWay/documents',
        resource_type: 'auto'
      });
      
      uploadResults.medicalReport = {
        url: reportUpload.secure_url,
        publicId: reportUpload.public_id
      };
      console.log('Medical report uploaded:', reportUpload.secure_url);
    }

    // Process address to extract district if available
    const district = data.address ? 
      data.address.split(',')[1]?.trim() ?? null : 
      null;

    // Update UserProfile
    const updatedUser = await prisma.userProfile.update({
      where: { id: userId },
      data: {
        firstname: data.firstName,
        lastname: data.lastName,
        email: data.email,
        mobile: data.phone,
        address: data.address,
        district,
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
        nic: data.nic,
        nic_pic: uploadResults.nicImage ? uploadResults.nicImage.url : undefined,
        dp: uploadResults.profileImage ? uploadResults.profileImage.url : undefined,
      },
    });

    // Prepare license types array
    const licenseTypes = Array.isArray(data.licenseType)
      ? data.licenseType
      : data.licenseType ? [data.licenseType] : [];
      
    // Prepare languages array
    const languages = Array.isArray(data.languages)
      ? data.languages
      : data.languages ? [data.languages] : [];

    // Upsert DriverProfile
    const updatedDriver = await prisma.driverProfile.upsert({
      where: { userId },
      update: {
        licenseId: data.licenseId,
        licenseExpiry: data.licenseExpiry ? new Date(data.licenseExpiry) : undefined,
        licenseType: licenseTypes,
        relocate: data.relocate === true,
        startedDriving: data.startedDriving
          ? new Date(data.startedDriving)
          : undefined,
        languages,
        licenseFront: uploadResults.licenseFront ? uploadResults.licenseFront.url : undefined,
        licenseBack: uploadResults.licenseBack ? uploadResults.licenseBack.url : undefined,
        policeReport: uploadResults.policeReport ? uploadResults.policeReport.url : undefined,
        medicalReport: uploadResults.medicalReport ? uploadResults.medicalReport.url : undefined,
        bio: data.bio,
      },
      create: {
        userId,
        licenseId: data.licenseId || '',
        licenseExpiry: data.licenseExpiry ? new Date(data.licenseExpiry) : new Date(),
        licenseType: licenseTypes.length > 0 ? licenseTypes : [],
        relocate: data.relocate === true,
        startedDriving: data.startedDriving
          ? new Date(data.startedDriving)
          : new Date(),
        languages,
        licenseFront: uploadResults.licenseFront ? uploadResults.licenseFront.url : null,
        licenseBack: uploadResults.licenseBack ? uploadResults.licenseBack.url : null,
        policeReport: uploadResults.policeReport ? uploadResults.policeReport.url : null,
        medicalReport: uploadResults.medicalReport ? uploadResults.medicalReport.url : null,
        bio: data.bio || '',
      },
    });

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser,
      driver: updatedDriver,
      uploadResults,
    });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { message: 'Failed to update profile', error: (error as Error).message },
      { status: 500 }
    );
  }
}