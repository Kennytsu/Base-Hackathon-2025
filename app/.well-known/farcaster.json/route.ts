import { NextResponse } from 'next/server';

export async function GET() {
  const manifest = {
    frame: {
      version: "1",
      name: "Piggyfi",
      iconUrl: "https://base-hackathon-2025-ten.vercel.app/blue-icon.png",
      homeUrl: "https://base-hackathon-2025-ten.vercel.app",
      imageUrl: "https://base-hackathon-2025-ten.vercel.app/blue-hero.png",
      buttonTitle: "Launch",
      splashImageUrl: "https://base-hackathon-2025-ten.vercel.app/blue-hero.png",
      splashBackgroundColor: "#000000",
      webhookUrl: "https://base-hackathon-2025-ten.vercel.app/api/webhook"
    }
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
