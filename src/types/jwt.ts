export interface JWTPayload {
  adminId: string;
  role: string;
  timestamp: number;
  iat?: number;
  exp?: number;
}
