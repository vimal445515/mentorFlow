import type { UserRole } from "../enums/UserRole.ts";
import type { UserStatus } from "../enums/UserStatus.ts";

export interface ManagedUserProps {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  profileImageUrl: string | null;
}

export class ManagedUser {
  public readonly id: string;
  public readonly fullName: string;
  public readonly email: string;
  public readonly role: UserRole;
  public readonly status: UserStatus;
  public readonly createdAt: Date;
  public readonly profileImageUrl: string | null;

  constructor(props: ManagedUserProps) {
    this.id = props.id;
    this.fullName = props.fullName;
    this.email = props.email;
    this.role = props.role;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.profileImageUrl = props.profileImageUrl;
  }
}
