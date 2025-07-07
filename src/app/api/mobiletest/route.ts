// app/api/your-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Handle CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204, // 204 is better for empty responses
    headers: corsHeaders,
  });
}

// Handle GET request
export async function GET(request: NextRequest) {
  return new NextResponse(JSON.stringify({ message: 'Success yo' }), {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

// Handle POST request
export async function POST(request: NextRequest) {
  const body = await request.json(); // You can parse body here if needed

  return new NextResponse(JSON.stringify({ message: 'Success', received: body }), {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
