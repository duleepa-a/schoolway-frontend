import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sql } from '../../../lib/db';
import { NextRequest, NextResponse } from 'next/server';
import LoginData from './schema';


export async function POST(req : NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  try {
    const body = await req.json();
    const validated = LoginData.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({message : 'Invalid request data'}, { status: 400 });
    }

    if (!body.email || !body.password) {
      return NextResponse.json({ 
        message: 'Email and password are required' 
      }, { status: 400 });
    }

    // Validate email format
    const { email, password } = body;

    // Find user by email
    const userResult = await sql`
      SELECT id, firstname, lastname, email, password, service_name, contact_number, service_registration_number, created_at
      FROM users 
      WHERE email = ${email}
    `;

    if (userResult.length === 0) {
      return NextResponse.json({ 
        message: 'Invalid email or password' 
      }, { status: 401 });
    }

    const user = userResult[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json({ 
        message: 'Invalid email or password' 
      }, { status: 401 });
    }

    // Optional: Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email 
      },
      process.env.JWT_SECRET!, 
      { expiresIn: '24h' }
    );

    // Update last login timestamp (optional)
    // await sql`
    //   UPDATE users 
    //   SET updated_at = NOW() 
    //   WHERE id = ${user.id}
    // `;

    return NextResponse.json({
      message: 'Login successful',
      token: token, // Include if using JWT
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        serviceName: user.service_name,
        contactNumber: user.contact_number,
        serviceRegistrationNumber: user.service_registration_number,
        createdAt: user.created_at
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ 
      message: 'Internal server error! ' 
    }, { status: 500 });
  }
}

