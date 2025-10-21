export interface JwtPayload {
  deviceId: string;
  type: 'device_access';
  iat?: number;
  exp?: number;
}
