import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { products, orderItems } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

// GET single product
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const product = await db.query.products.findFirst({
      where: eq(products.id, resolvedParams.id),
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update product (admin only)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const resolvedParams = params instanceof Promise ? await params : params;
    const productId = resolvedParams.id;

    // Fetch product first to check current state
    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const formData = await req.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const quantity = formData.get('quantity') as string;
    const category = formData.get('category') as string;
    const image = formData.get('image') as File | null;
    // Handle isActive checkbox (FormData sends 'true'/'false' as string, or we default to current state)
    const isActiveRaw = formData.get('isActive');
    const isActive = isActiveRaw === 'true' || (isActiveRaw === null ? product.isActive : isActiveRaw === 'on');

    let imageUrl = product.imageUrl;
    let imagePublicId = product.imagePublicId;

    // If new image is provided, upload it and delete old one
    if (image && image.size > 0) {
      const { url, publicId } = await uploadToCloudinary(image);
      await deleteFromCloudinary(product.imagePublicId);
      imageUrl = url;
      imagePublicId = publicId;
    }

    // Update product
    const [updatedProduct] = await db.update(products)
      .set({
        name,
        description,
        price,
        quantity: parseInt(quantity),
        category,
        imageUrl,
        imagePublicId,
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId))
      .returning();

    return NextResponse.json({ product: updatedProduct });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete product (admin only)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Handle both sync and async params (Next.js 14+ compatibility)
    const resolvedParams = params instanceof Promise ? await params : params;
    const productId = resolvedParams.id;

    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if product is referenced in any order items
    const existingOrderItems = await db.query.orderItems.findFirst({
      where: eq(orderItems.productId, productId),
    });

    if (existingOrderItems) {
      // Instead of hard delete, soft delete by setting isActive to false
      // This preserves order history
      await db.update(products)
        .set({ 
          isActive: false,
          updatedAt: new Date(),
        })
        .where(eq(products.id, productId));

      return NextResponse.json({ 
        message: 'Product deactivated successfully (cannot be deleted as it has order history)',
        deactivated: true,
      });
    }

    // Safe to hard delete - no order history exists
    // Delete image from Cloudinary (only if product has imagePublicId)
    if (product.imagePublicId) {
      try {
        await deleteFromCloudinary(product.imagePublicId);
      } catch (cloudinaryError) {
        console.error('Cloudinary delete error (non-blocking):', cloudinaryError);
        // Continue with deletion even if Cloudinary fails
      }
    }

    // Delete product
    await db.delete(products).where(eq(products.id, productId));

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

