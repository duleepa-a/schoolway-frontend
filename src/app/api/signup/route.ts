// import { PrismaClient } from '@prisma/client'
// import bcrypt from 'bcryptjs'
// const prisma = new PrismaClient()

import bcrypt from 'bcryptjs';
import { sql } from '../../../lib/db';
import { NextRequest, NextResponse } from 'next/server';
import SignUpdata from './schema';
const SALTRounds = 12;
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  console.log('Checking email availability');

  const email = req.headers.get('email');
  if (!email) {
    return NextResponse.json({ message: 'Email header is required' }, { status: 400 });
  }

  const existingUser = await prisma.userProfile.findUnique({
    where: { email },
  });

  // const existingUser = await sql`
  //   SELECT * FROM userprofile`;

  // console.log('Existing user:', existingUser);

  if (existingUser) {
    return NextResponse.json({ 
      message: 'User with this email already exists' 
    }, { status: 409 });
  }

  return NextResponse.json({ message: 'Valid email' }, { status: 200 });
}


export async function POST(req:NextRequest) {
  try {
    const body = await req.json();
    const validation = SignUpdata.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({
        errors: validation.error.errors 
      },{status: 400});
    }
    
    // const existingUser = await sql`
    //   SELECT id FROM users 
    //   WHERE email = ${body.email}
    // `;
    const existingUser = await prisma.userProfile.findUnique({
    where: { email: body.email },
  });

    if (existingUser) {
      return NextResponse.json({ 
        message: 'User with this already exists' 
      }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(body.password, SALTRounds);

    // First, create the user profile
    const newUser = await prisma.userProfile.create({
      data: {
      firstname: body.firstName,
      lastname: body.lastName,
      email: body.email,
      password: hashedPassword,
      role: 'SERVICE',
      createdAt: new Date(),
      // VanService will be created below
      }
    });

    const newVanService = await prisma.vanService.create({
      data: {
      serviceName: body.serviceName,
      contactNo: body.contactNumber,
      serviceRegNumber: body.serviceRegistrationNumber,
      // businessDocument: body.businessDocument || null,
      userId: newUser.id,
      }
    });

    // const result = await sql`
    //   INSERT INTO users (
    //     firstName,  
    //     lastName,
    //     email, 
    //     password, 
    //     role, 
    //     -- contact_number, 
    //     -- service_registration_number,
    //     created_at
    //   ) 
    //   VALUES (
    //     ${body.firstName}, 
    //     ${body.lastName},
    //     ${body.email}, 
    //     ${hashedPassword}, 
    //     "SERVICE",
    //     -- ${body.serviceName}, 
    //     -- ${body.contactNumber}, 
    //     -- ${body.serviceRegistrationNumber},
    //     NOW()
    //   )
    //   RETURNING id, firstName, lastName, email, service_name, contact_number, service_registration_number, created_at
    // `;

    if (newUser === null) {
      return NextResponse.json({ 
        message: 'User registration failed' 
      }, { status: 500 });
    }
    return NextResponse.json({
      message: 'User registered successfully'},{status: 201})
   
  }catch (error : any) {
    console.error('Registration error:', error);
    
    if (error.code === '23505') { 
      return NextResponse.json({ 
        message: 'User with this email already exists' 
      }, { status: 409 });
    }
    
    return NextResponse.json({ message: error.message 
    }, { status: 500 });
  }
}




























// export async function POST(req: Request) {
//   const { email, password } = await req.json()

//   if (!email || !password) {
//     return new Response(JSON.stringify({ error: 'Email and password are required' }), { status: 400 })
//   }

//   const existingUser = await prisma.user.findUnique({ where: { email } })

//   if (existingUser) {
//     return new Response(JSON.stringify({ error: 'User already exists' }), { status: 409 })
//   }

//   const hashedPassword = await bcrypt.hash(password, 10)

//   const newUser = await prisma.user.create({
//     data: {
//       email,
//       password: hashedPassword,
//     },
//   })

//   return new Response(JSON.stringify({ message: 'User created', userId: newUser.id }), { status: 201 })
// }


