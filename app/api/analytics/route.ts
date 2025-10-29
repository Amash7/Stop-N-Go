import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { sql, gte } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get data for the last 12 months
    const oneYearAgo = new Date();
    oneYearAgo.setMonth(oneYearAgo.getMonth() - 11);
    oneYearAgo.setDate(1);
    oneYearAgo.setHours(0, 0, 0, 0);

    const monthlyData = await db.execute(sql`
      SELECT 
        TO_CHAR(created_at, 'YYYY-MM') as month,
        COALESCE(SUM(CASE WHEN status = 'approved' THEN CAST(total_amount AS DECIMAL) ELSE 0 END), 0) as approved_amount,
        COALESCE(SUM(CASE WHEN status = 'discarded' THEN CAST(total_amount AS DECIMAL) ELSE 0 END), 0) as discarded_amount,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_count,
        COUNT(CASE WHEN status = 'discarded' THEN 1 END) as discarded_count
      FROM ${orders}
      WHERE created_at >= ${oneYearAgo.toISOString()}
      GROUP BY TO_CHAR(created_at, 'YYYY-MM')
      ORDER BY month ASC
    `);

    // Format the data for the chart
    const formattedData = monthlyData.rows.map((row: any) => ({
      month: new Date(row.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      approved: parseFloat(row.approved_amount || '0'),
      discarded: parseFloat(row.discarded_amount || '0'),
      approvedCount: parseInt(row.approved_count || '0'),
      discardedCount: parseInt(row.discarded_count || '0'),
    }));

    return NextResponse.json({ data: formattedData });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

