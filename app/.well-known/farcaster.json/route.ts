import { NextResponse } from 'next/server';

export async function GET() {
  const ROOT_URL = "https://base-hackathon-2025-ten.vercel.app";
  
  const manifest = {
    frame: {
      version: "1",
      name: "Piggyfi",
      iconUrl: `${ROOT_URL}/blue-icon.svg`,
      homeUrl: ROOT_URL,
      imageUrl: `${ROOT_URL}/blue-hero.svg`,
      buttonTitle: "Launch",
      splashImageUrl: `${ROOT_URL}/blue-hero.svg`,
      splashBackgroundColor: "#000000",
      webhookUrl: `${ROOT_URL}/api/webhook`
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
