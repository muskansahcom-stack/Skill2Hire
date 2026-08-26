import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    let notifications = userId
      ? db.getNotificationsByUserId(userId)
      : db.getNotifications().slice(0, 10);

    const unreadCount = notifications.filter(n => !n.read).length;

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { notificationId } = body;

    if (notificationId) {
      db.markNotificationRead(notificationId);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
