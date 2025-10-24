import { NextResponse } from 'next/server';

export async function GET() {
  const ROOT_URL = "https://base-hackathon-2025-ten.vercel.app";
  
  const manifest = {
    miniapp: {
      version: "1",
      name: "Piggyfi",
      subtitle: "Smart Savings & Social Accountability",
      description: "Create piggy banks, set savings goals, and stay accountable with friends on Base blockchain",
      iconUrl: `${ROOT_URL}/blue-icon.svg`,
      splashImageUrl: `${ROOT_URL}/blue-hero.svg`,
      splashBackgroundColor: "#000000",
      homeUrl: ROOT_URL,
      webhookUrl: `${ROOT_URL}/api/webhook`,
      primaryCategory: "social",
      tags: ["finance", "savings", "social", "base", "blockchain"],
      heroImageUrl: `${ROOT_URL}/blue-hero.svg`,
      tagline: "Save smarter, together",
      screenshotUrls: [`${ROOT_URL}/screenshot-portrait.svg`]
    },
    baseBuilder: {
      ownerAddress: "0xc0f984a09fc45dcEbCFCb7088CFAa1D5f8d227C2"
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
