export type Member = { 
  id: string; 
  name: string; 
  address?: string; 
  avatarHue?: number; 
  breaks: number;
  fid?: number; // Farcaster ID
  pfpUrl?: string; // Profile picture URL
  farcasterUsername?: string; // @username
};

export type RuleType = "WORD_BAN" | "POST_QUOTA" | "CUSTOM";

export type RuleConfig = {
  bannedWords?: string[];
  minPostsPerWeek?: number;
  description?: string;
};

export type Rule = { 
  id: string; 
  label: string; 
  type: RuleType; 
  config: RuleConfig; 
  penaltyEth: number 
};

export type Infraction = { 
  id: string; 
  memberId: string; 
  ruleId: string; 
  notes?: string; 
  timestamp: number; 
  penaltyEth: number 
};

export type Piggybank = {
  id: string;
  name: string;
  theme?: string;
  createdAt: number;
  potEth: number;
  entryStakeEth: number;
  rules: Rule[];
  members: Member[];
  infractions: Infraction[];
  periodEndsAt: number;
  image?: string;
  inviteCode?: string; // Unique code for sharing
  creatorAddress?: string; // Who created this piggybank
};