export class AuthenticatedUserDTO {
  deviceId: string;

  constructor(deviceId: string) {
    this.deviceId = deviceId;
  }
}
