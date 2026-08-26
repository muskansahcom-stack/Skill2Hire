import { NextResponse } from 'next/server';
import { generateInitialDatabase } from '@/lib/seedData';
import { saveDb } from '@/lib/db';

export async function POST() {
  try {
    const initialDb = generateInitialDatabase();
    saveDb(initialDb);

    return NextResponse.json({
      success: true,
      message: 'Demo database has been successfully reset to initial pristine state.'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
