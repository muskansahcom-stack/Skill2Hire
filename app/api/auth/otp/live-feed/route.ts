import { NextResponse } from 'next/server';
import { getRecentDispatches } from '@/lib/otpService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const destination = searchParams.get('destination');

    let list = getRecentDispatches();
    if (destination) {
      const clean = destination.toLowerCase().replace(/[^a-z0-9@.]/g, '');
      list = list.filter(d => {
        const dClean = d.destination.toLowerCase().replace(/[^a-z0-9@.]/g, '');
        return dClean === clean || dClean.includes(clean) || clean.includes(dClean);
      });
    }

    return NextResponse.json({
      success: true,
      dispatches: list.slice(0, 10)
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch live dispatches' }, { status: 500 });
  }
}
