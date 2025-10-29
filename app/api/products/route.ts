import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { uploadToCloudinary } from '@/lib/cloudinary';

// GET all products (public)
export async function GET() {
  try {
    const allProducts = await db.query.products.findMany({
      where: eq(products.isActive, true),
      orderBy: [desc(products.createdAt)],
    });

    return NextResponse.json({ products: allProducts });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new product (admin only)
export async function POST(req: Request) {
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
    const image = formData.get('image') as File;

    if (!name || !description || !price || !quantity || !category || !image) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Upload image to Cloudinary
    const { url, publicId } = await uploadToCloudinary(image);

    // Create product
    const [newProduct] = await db.insert(products).values({
      name,
      description,
      price,
      quantity: parseInt(quantity),
      category,
      imageUrl: url,
      imagePublicId: publicId,
    }).returning();

    return NextResponse.json({ product: newProduct });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

