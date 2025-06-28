import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic'; // For file uploads

export async function POST(req: NextRequest) {
  try {
    // Parse multipart/form-data
    const formData = await req.formData();
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const serviceName = formData.get('serviceName') as string;
    const contactNo = formData.get('contactNo') as string;
    const profilePhoto = formData.get('profilePhoto') as File | null;
    const businessLicense = formData.get('businessLicense') as File | null;

    if (!firstName || !lastName || !email || !password || !serviceName || !contactNo) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // Check if email already exists
    const emailCheck = await sql.query('SELECT id FROM users WHERE email = $1', [email]);
    if (emailCheck.length > 0) {
      return NextResponse.json({ error: 'Email already registered.' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Handle file uploads
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    let profilePhotoUrl: string | null = null;
    let businessLicenseUrl: string | null = null;

    if (profilePhoto && profilePhoto.size > 0) {
      const profilePhotoBuffer = Buffer.from(await profilePhoto.arrayBuffer());
      const profilePhotoName = `profile_${Date.now()}_${profilePhoto.name}`;
      const profilePhotoPath = path.join(uploadsDir, profilePhotoName);
      await fs.writeFile(profilePhotoPath, profilePhotoBuffer);
      profilePhotoUrl = `/uploads/${profilePhotoName}`;
    }

    if (businessLicense && businessLicense.size > 0) {
      const businessLicenseBuffer = Buffer.from(await businessLicense.arrayBuffer());
      const businessLicenseName = `license_${Date.now()}_${businessLicense.name}`;
      const businessLicensePath = path.join(uploadsDir, businessLicenseName);
      await fs.writeFile(businessLicensePath, businessLicenseBuffer);
      businessLicenseUrl = `/uploads/${businessLicenseName}`;
    }

    // Insert user
    const userResult = await sql.query(
      'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING id',
      [firstName, lastName, email, hashedPassword]
    );
    const userId = userResult[0]?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Failed to create user.' }, { status: 500 });
    }

    // Insert van service
    await sql.query(
      'INSERT INTO van_services (user_id, service_name, contact_no, profile_photo_url, business_license_url) VALUES ($1, $2, $3, $4, $5)',
      [userId, serviceName, contactNo, profilePhotoUrl, businessLicenseUrl]
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
} 