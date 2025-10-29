import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';

// GET single product
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await db.query.products.findFirst({
      where: eq(products.id, params.id),
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

    const formData = await req.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const quantity = formData.get('quantity') as string;
    const category = formData.get('category') as string;
    const image = formData.get('image') as File | null;

    const product = await db.query.products.findFirst({
      where: eq(products.id, params.id),
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

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
        updatedAt: new Date(),
      })
      .where(eq(products.id, params.id))
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

    const product = await db.query.products.findFirst({
      where: eq(products.id, params.id),
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Delete image from Cloudinary
    await deleteFromCloudinary(product.imagePublicId);

    // Delete product
    await db.delete(products).where(eq(products.id, params.id));

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

