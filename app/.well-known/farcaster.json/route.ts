import { NextResponse } from 'next/server';
import { minikitConfig } from '../../../minikit.config';

export async function GET() {
  // Build manifest conditionally
  const manifest: any = {
    frame: {
      version: "1",
      name: minikitConfig.miniapp.name,
      iconUrl: minikitConfig.miniapp.iconUrl,
      homeUrl: minikitConfig.miniapp.homeUrl,
      imageUrl: minikitConfig.miniapp.heroImageUrl,
      buttonTitle: "Launch",
      splashImageUrl: minikitConfig.miniapp.splashImageUrl,
      splashBackgroundColor: minikitConfig.miniapp.splashBackgroundColor,
      webhookUrl: minikitConfig.miniapp.webhookUrl,
    },
    miniapp: {
      version: minikitConfig.miniapp.version,
      name: minikitConfig.miniapp.name,
      subtitle: minikitConfig.miniapp.subtitle,
      description: minikitConfig.miniapp.description,
      iconUrl: minikitConfig.miniapp.iconUrl,
      splashImageUrl: minikitConfig.miniapp.splashImageUrl,
      splashBackgroundColor: minikitConfig.miniapp.splashBackgroundColor,
      homeUrl: minikitConfig.miniapp.homeUrl,
      webhookUrl: minikitConfig.miniapp.webhookUrl,
      primaryCategory: minikitConfig.miniapp.primaryCategory,
      tags: minikitConfig.miniapp.tags,
      heroImageUrl: minikitConfig.miniapp.heroImageUrl,
      tagline: minikitConfig.miniapp.tagline,
      screenshotUrls: minikitConfig.miniapp.screenshotUrls,
    },
    baseBuilder: {
      ownerAddress: "0xc0f984a09fc45dcEbCFCb7088CFAa1D5f8d227C2"
    }
  };

  // Only add accountAssociation if it's been filled with signed values
  if (minikitConfig.accountAssociation.header && 
      minikitConfig.accountAssociation.payload && 
      minikitConfig.accountAssociation.signature) {
    manifest.accountAssociation = {
      header: minikitConfig.accountAssociation.header,
      payload: minikitConfig.accountAssociation.payload,
      signature: minikitConfig.accountAssociation.signature,
    };
  }

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
