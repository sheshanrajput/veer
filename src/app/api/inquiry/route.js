import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: "This endpoint is deprecated. Please submit inquiries via the contact page API." },
    { status: 410 }
  );
}
