
import { NextResponse } from 'next/server';

export async function POST() {
    return new NextResponse('This endpoint is no longer available.', { status: 404 });
}
