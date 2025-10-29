import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { generateVIPNumber } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user already has VIP
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    if (user?.vipNumber) {
      return NextResponse.json(
        { error: 'Already enrolled in VIP Circle' },
        { status: 400 }
      );
    }

    // Generate unique VIP number
    let vipNumber: string;
    let isUnique = false;
    
    while (!isUnique) {
      vipNumber = generateVIPNumber();
      const existing = await db.query.users.findFirst({
        where: eq(users.vipNumber, vipNumber),
      });
      if (!existing) {
        isUnique = true;
      }
    }

    // Update user with VIP number
    await db.update(users)
      .set({ vipNumber: vipNumber! })
      .where(eq(users.id, session.user.id));

    return NextResponse.json({
      vipNumber: vipNumber!,
      message: 'Successfully enrolled in VIP Circle!',
    });
  } catch (error) {
    console.error('VIP enrollment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

