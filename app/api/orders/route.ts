import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { orders, orderItems, products } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { generateOrderNumber } from '@/lib/utils';

// GET orders
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let userOrders;

    if (session.user.role === 'admin') {
      // Admin sees all orders
      userOrders = await db.query.orders.findMany({
        with: {
          user: true,
          items: {
            with: {
              product: true,
            },
          },
        },
        orderBy: [desc(orders.createdAt)],
      });
    } else {
      // Customer sees only their orders
      userOrders = await db.query.orders.findMany({
        where: eq(orders.userId, session.user.id),
        with: {
          items: {
            with: {
              product: true,
            },
          },
        },
        orderBy: [desc(orders.createdAt)],
      });
    }

    return NextResponse.json({ orders: userOrders });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new order
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { items } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Verify stock and calculate total
    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await db.query.products.findFirst({
        where: eq(products.id, item.id),
      });

      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.name} not found` },
          { status: 400 }
        );
      }

      if (product.quantity < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }

      const subtotal = parseFloat(product.price) * item.quantity;
      totalAmount += subtotal;

      orderItemsData.push({
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        quantity: item.quantity,
        subtotal: subtotal.toString(),
      });

      // NOTE: Stock is NOT reduced here - only when admin approves the order
    }

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Create order
    const [newOrder] = await db.insert(orders).values({
      userId: session.user.id,
      orderNumber,
      totalAmount: totalAmount.toString(),
      status: 'pending',
    }).returning();

    // Create order items
    for (const itemData of orderItemsData) {
      await db.insert(orderItems).values({
        orderId: newOrder.id,
        ...itemData,
      });
    }

    return NextResponse.json({
      order: newOrder,
      message: 'Order placed successfully! Please visit the store for pickup.',
    });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

