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
    header: "",
    payload: "",
    signature: ""
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

