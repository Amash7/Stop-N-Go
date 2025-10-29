import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { orders, users, products } from '@/lib/db/schema';
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

    const { adminNote } = await req.json();

    const order = await db.query.orders.findFirst({
      where: eq(orders.id, params.id),
      with: {
        user: true,
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

    // CRITICAL: Reduce stock when approving order
    for (const item of order.items) {
      const product = await db.query.products.findFirst({
        where: eq(products.id, item.productId),
      });

      if (product) {
        // Reduce stock quantity
        await db.update(products)
          .set({ quantity: Math.max(0, product.quantity - item.quantity) })
          .where(eq(products.id, item.productId));
      }
    }

    // Update order status
    await db.update(orders)
      .set({
        status: 'approved',
        approvedAt: new Date(),
        adminNote: adminNote || null,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, params.id));

    // If user has VIP, increment their approved orders count
    if (order.user.vipNumber) {
      await db.update(users)
        .set({
          vipApprovedOrders: order.user.vipApprovedOrders + 1,
        })
        .where(eq(users.id, order.userId));
    }

    return NextResponse.json({
      message: 'Order approved successfully',
    });
  } catch (error) {
    console.error('Approve order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

