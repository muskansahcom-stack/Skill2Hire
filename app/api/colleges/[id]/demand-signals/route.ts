import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const signals = db.getDemandSignals();

    return NextResponse.json({
      success: true,
      signals
    });
  } catch (error) {
    console.error('Error fetching demand signals:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
