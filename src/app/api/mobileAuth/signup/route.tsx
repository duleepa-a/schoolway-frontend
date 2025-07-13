// import { PrismaClient } from '@prisma/client'
// import bcrypt from 'bcryptjs'
// const prisma = new PrismaClient()

import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
const SALTRounds = 12;
import prisma from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // adjust if needed
    },
  },
};

export async function POST(req: NextRequest) {
  try {
    console.log('Received request for signup');
    
    // Convert NextRequest to Node.js readable stream for formidable
    const contentLength = req.headers.get('content-length');
    const contentType = req.headers.get('content-type');
    
    if (!contentType?.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Content type must be multipart/form-data' }, { status: 400 });
    }

    // Get the request body as buffer
    const body = await req.arrayBuffer();
    const buffer = Buffer.from(body);

    // Parse form data using formidable
    const form = formidable({ 
      multiples: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    // Convert buffer to a readable stream for formidable
    const { Readable } = require('stream');
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    // Add headers to stream for formidable
    stream.headers = {
      'content-type': contentType,
      'content-length': contentLength,
    };

    const [fields, files] = await form.parse(stream);

    // Extract text fields
    const textFields: any = {};
    Object.keys(fields).forEach(key => {
      textFields[key] = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
    });

    console.log('Text fields received:', textFields);

    // Handle image uploads
    const uploadResults: any = {};

    // Upload license images if driver
    if(textFields.role === 'DRIVER'){
        if (files.licenseFront && files.licenseFront[0]) {
        const frontFile = files.licenseFront[0];
        console.log('Uploading license front image...');
        
        const frontUpload = await cloudinary.uploader.upload(frontFile.filepath, {
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

      // Upload license back image
      if (files.licenseBack && files.licenseBack[0]) {
        const backFile = files.licenseBack[0];
        console.log('Uploading license back image...');
        
        const backUpload = await cloudinary.uploader.upload(backFile.filepath, {
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
    }

    if (files.nic_img && files.nic_img[0]) {
      const nicFile = files.nic_img[0];
      console.log('Uploading NIC image...');
      
      const nicUpload = await cloudinary.uploader.upload(nicFile.filepath, {
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

    // Upload profile data
    const userdata = await prisma.userProfile.create({
      data: {
        firstname: textFields.firstname,
        lastname: textFields.lastname,
        email: textFields.email,
        password: await bcrypt.hash(textFields.password, SALTRounds),
        role: textFields.role,
        nic: textFields.nic,
        nic_pic: uploadResults.nicImage ? uploadResults.nicImage.url : null,
        // nic_pic_cld_id: uploadResults.nicImage ? uploadResults.nicImage.public_id : null,
        birthDate: textFields.birthDate ? new Date(textFields.birthDate) : null,
        address: textFields.address,
        activeStatus: textFields.role==="DRIVER" ? false : true, 
        // phoneNumber: textFields.phoneNumber,
        // profilePhoto: files.profilePhoto ? files.profilePhoto[0].filepath : null,
        createdAt: new Date(),
      }
    });

    if (textFields.role === 'DRIVER') {
      const driverData: any = {
        userId: userdata.id,
        licenseId: textFields.licenseId,
        licenseFront: uploadResults.licenseFront ? uploadResults.licenseFront.url : null,
        licenseBack: uploadResults.licenseBack ? uploadResults.licenseBack.url : null,
        licenseExpiry: textFields.licenseExpiry ? new Date(textFields.licenseExpiry) : null,
        // policereport: textFields.policeReport || null,
        // Add any other driver-specific fields here
      };

      const driver = await prisma.driverProfile.create({
        data: {
          userId: userdata.id,
          licenseId: textFields.licenseId,
          licenseFront: uploadResults.licenseFront ? uploadResults.licenseFront.url : null,
          licenseBack: uploadResults.licenseBack ? uploadResults.licenseBack.url : null,
          licenseExpiry: textFields.licenseExpiry ? new Date(textFields.licenseExpiry) : new Date(),
          // policereport: textFields.policeReport || null,
          // Add any other driver-specific fields here
        }
      });

      console.log('Driver profile created:', driver);
    }

    return NextResponse.json({
      message: 'Data received and images uploaded successfully',
      textFields,
      uploadedImages: uploadResults
    });

  } catch (error: any) {
    console.error('Signup API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
