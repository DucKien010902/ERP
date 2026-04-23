export interface CurrentUserPayload {
  sub: string;
  email: string;
  organizationId: string;
  fullName: string;
  roleCodes: string[];
  permissions: string[];
}
