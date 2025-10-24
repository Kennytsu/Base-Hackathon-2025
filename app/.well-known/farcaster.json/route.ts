import { NextResponse } from 'next/server';
import { minikitConfig } from '../../../minikit.config';

export async function GET() {
  const manifest: any = {};

  // Add accountAssociation only if signed
  if (minikitConfig.accountAssociation.header && 
      minikitConfig.accountAssociation.payload && 
      minikitConfig.accountAssociation.signature) {
    manifest.accountAssociation = {
      header: minikitConfig.accountAssociation.header,
      payload: minikitConfig.accountAssociation.payload,
      signature: minikitConfig.accountAssociation.signature,
    };
  }

  // Add baseBuilder section per docs
  manifest.baseBuilder = {
    ownerAddress: "0xc0f984a09fc45dcEbCFCb7088CFAa1D5f8d227C2"
  };

  // Add miniapp section with all fields per docs
  manifest.miniapp = {
    version: minikitConfig.miniapp.version,
    name: minikitConfig.miniapp.name,
    homeUrl: minikitConfig.miniapp.homeUrl,
    iconUrl: minikitConfig.miniapp.iconUrl,
    splashImageUrl: minikitConfig.miniapp.splashImageUrl,
    splashBackgroundColor: minikitConfig.miniapp.splashBackgroundColor,
    webhookUrl: minikitConfig.miniapp.webhookUrl,
    subtitle: minikitConfig.miniapp.subtitle,
    description: minikitConfig.miniapp.description,
    screenshotUrls: minikitConfig.miniapp.screenshotUrls,
    primaryCategory: minikitConfig.miniapp.primaryCategory,
    tags: minikitConfig.miniapp.tags,
    heroImageUrl: minikitConfig.miniapp.heroImageUrl,
    tagline: minikitConfig.miniapp.tagline,
    ogTitle: minikitConfig.miniapp.ogTitle,
    ogDescription: minikitConfig.miniapp.ogDescription,
    ogImageUrl: minikitConfig.miniapp.ogImageUrl,
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
