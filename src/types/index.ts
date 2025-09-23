export interface StatsResponse {
    rate: number;
    impressions: number;
    impressionsMonthBefore: number;
    distributed: number;
    activeUsers: number; // users with at least 1 link
    fundingGoal: number; // funding goal in XNO
    funds: number; // funds in XNO
}

export interface LoginResponse {
    aycaramba: string
    success: boolean
    address: string
    uuid: string
    loginKey: string
}
  

export interface CreateLinkRequest {
    destination: string;
    shortLink?: string;
    earn?: boolean;
}

export interface MeResponse {
  success: boolean
  links: number
  claimable: number
  totalEarned: number
  totalImpressions: number
  address: string
  admin: boolean
}

export interface ShortLink {
  id: string
  userId: string
  createdAt: string
  updatedAt: string
  destination: string
  shortUrl: string
  shouldEarn: boolean
  claimable: number
  earned: number
  impressions: number
}

export interface ChangeSettingsRequest {
    autoClaim: boolean;
    autoClaimThreshold: number; // 0-1
}

export interface UserData {
  id: string;
  username: string;
  email?: string;
  links: number;
  claimable: number;
  totalImpressions: number;
  totalEarned: number;
  createdAt: string;
}

export interface Settings {
  autoClaim: boolean;
  autoClaimThreshold: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
