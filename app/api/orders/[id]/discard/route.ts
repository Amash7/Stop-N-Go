import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { orders, orderItems, products } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const order = await db.query.orders.findFirst({
      where: eq(orders.id, params.id),
      with: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    if (order.status !== 'pending') {
      return NextResponse.json(
        { error: 'Order already processed' },
        { status: 400 }
      );
    }

    // NOTE: Stock is NOT restored here because it was never reduced
    // Stock is only reduced when orders are approved
    
    // Update order status
    await db.update(orders)
      .set({
        status: 'discarded',
        discardedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(orders.id, params.id));

    return NextResponse.json({
      message: 'Order discarded successfully',
    });
  } catch (error) {
    console.error('Discard order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

