export interface GoogleUserProfile {
  googleId: string;
  email: string;
  fullName: string;
  profileImageUrl?: string;
}

export interface IGoogleAuthService {
  verifyToken(credentialToken: string): Promise<GoogleUserProfile>;
}
