const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000');

/**
 * MiniApp configuration object. Must follow the Farcaster MiniApp specification.
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
 */
export const minikitConfig = {
  accountAssociation: {
    header: "eyJmaWQiOjE0MDEzNjEsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHgzRmE3Y2VCMGVGMTg0M2IzNDA1QzBmNzk1NDA2OTQ3N2IyMTVEMTUxIn0",
    payload: "eyJkb21haW4iOiJiYXNlLWhhY2thdGhvbi0yMDI1LXRlbi52ZXJjZWwuYXBwIn0",
    signature: "vLleUPtwV7Q5b4n2r2vmREOcpG9MxHpRkuk0DkT3jDQRLMbEBALrFcVmHvqelY4UBHH7Wv9yEKzgmiOQgnl4kxw="
  },
  miniapp: {
    version: "1",
    name: "Piggyfi", 
    subtitle: "Smart Savings & Social Accountability", 
    description: "Create piggy banks, set savings goals, and stay accountable with friends on Base blockchain",
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`],
    iconUrl: `${ROOT_URL}/blue-icon.png`,
    splashImageUrl: `${ROOT_URL}/blue-hero.png`,
    splashBackgroundColor: "#000000",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "social",
    tags: ["finance", "savings", "social", "base", "blockchain"],
    heroImageUrl: `${ROOT_URL}/blue-hero.png`, 
    tagline: "Save smarter, together",
    ogTitle: "Piggyfi - Smart Savings on Base",
    ogDescription: "Create piggy banks, set savings goals, and stay accountable with friends on Base blockchain",
    ogImageUrl: `${ROOT_URL}/blue-hero.png`,
  },
} as const;

