// Farcaster API client using Neynar
const NEYNAR_API_KEY = process.env.NEXT_PUBLIC_NEYNAR_API_KEY || '';
const NEYNAR_BASE_URL = 'https://api.neynar.com/v2';

export interface FarcasterUser {
  fid: number;
  username: string;
  address: string;
  pfpUrl: string;
  displayName: string;
  bio?: string;
}

export interface FarcasterCast {
  hash: string;
  text: string;
  timestamp: string;
  author: {
    fid: number;
    username: string;
  };
}

class FarcasterClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string = NEYNAR_API_KEY, baseUrl: string = NEYNAR_BASE_URL) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'api_key': this.apiKey,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Farcaster API request failed:', error);
      throw error;
    }
  }

  /**
   * Look up a Farcaster user by username
   * @param username - Username without @ symbol (e.g., "dwr", not "@dwr")
   */
  async lookupUser(username: string): Promise<FarcasterUser> {
    // Remove @ if present
    const cleanUsername = username.startsWith('@') ? username.slice(1) : username;
    
    try {
      const response = await this.request<any>(
        `/farcaster/user/by_username?username=${encodeURIComponent(cleanUsername)}`
      );

      const user = response.user;
      if (!user) {
        throw new Error(`User @${cleanUsername} not found`);
      }

      // Extract verified address (custody or verified)
      const address = user.verified_addresses?.eth_addresses?.[0] || 
                     user.custody_address ||
                     '';

      return {
        fid: user.fid,
        username: user.username,
        address,
        pfpUrl: user.pfp_url || '',
        displayName: user.display_name || user.username,
        bio: user.profile?.bio?.text || '',
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to lookup @${cleanUsername}: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Look up a Farcaster user by wallet address
   */
  async getUserByAddress(address: string): Promise<FarcasterUser | null> {
    try {
      const response = await this.request<any>(
        `/farcaster/user/bulk-by-address?addresses=${encodeURIComponent(address)}`
      );

      const users = response?.[address];
      if (!users || users.length === 0) {
        return null;
      }

      const user = users[0];
      return {
        fid: user.fid,
        username: user.username,
        address: user.verified_addresses?.eth_addresses?.[0] || user.custody_address,
        pfpUrl: user.pfp_url || '',
        displayName: user.display_name || user.username,
        bio: user.profile?.bio?.text || '',
      };
    } catch (error) {
      console.error('Failed to lookup user by address:', error);
      return null;
    }
  }

  /**
   * Get recent casts from a user
   */
  async getUserCasts(fid: number, limit: number = 25): Promise<FarcasterCast[]> {
    try {
      const response = await this.request<any>(
        `/farcaster/feed/user/${fid}/casts?limit=${limit}`
      );

      const casts = response.casts || [];
      return casts.map((cast: any) => ({
        hash: cast.hash,
        text: cast.text,
        timestamp: cast.timestamp,
        author: {
          fid: cast.author.fid,
          username: cast.author.username,
        },
      }));
    } catch (error) {
      console.error('Failed to get user casts:', error);
      return [];
    }
  }

  /**
   * Batch lookup multiple users by username
   */
  async lookupUsers(usernames: string[]): Promise<Map<string, FarcasterUser>> {
    const results = new Map<string, FarcasterUser>();
    
    // Process in batches to avoid rate limits
    for (const username of usernames) {
      try {
        const user = await this.lookupUser(username);
        results.set(username, user);
      } catch (error) {
        console.error(`Failed to lookup ${username}:`, error);
      }
    }
    
    return results;
  }
}

// Export singleton instance
export const farcasterClient = new FarcasterClient();

// Helper function to validate username format
export function isValidFarcasterUsername(username: string): boolean {
  const cleanUsername = username.startsWith('@') ? username.slice(1) : username;
  // Farcaster usernames are 1-16 characters, alphanumeric + hyphen + underscore
  return /^[a-zA-Z0-9_-]{1,16}$/.test(cleanUsername);
}

// Helper to format username with @
export function formatUsername(username: string): string {
  return username.startsWith('@') ? username : `@${username}`;
}

