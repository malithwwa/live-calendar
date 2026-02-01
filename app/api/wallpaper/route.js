// app/wallpaper/route.ts
import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  const imagePath = join(process.cwd(), 'screenshots', 'wallpaper.png');

  try {
    const imageBuffer = readFileSync(imagePath);

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
      },
    });
  } catch (error) {
    return new NextResponse('Wallpaper not found', { status: 404 });
  }
}