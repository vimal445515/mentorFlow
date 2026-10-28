import { UserRole } from "../enums/UserRole.ts";
export interface UserProps {
  id?: string;
  fullName: string;
  email: string;
  passwordHash?: string | null;
  role: UserRole;
  profileImageUrl?: string | null;
  status?: string;
  googleId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  public readonly id?: string | undefined;
  public fullName: string;
  public email: string;
  public passwordHash?: string | null;
  public role: UserRole;
  public profileImageUrl: string;
  public status: string;
  public googleId?: string | null;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  constructor(props: UserProps) {
    this.id = props.id;
    this.fullName = props.fullName;
    this.email = props.email;
    this.passwordHash = props.passwordHash ?? null;
    this.role = props.role;
    this.profileImageUrl = props.profileImageUrl || "";
    this.status = props.status || "ACTIVE";
    this.googleId = props.googleId ?? null;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }
}
