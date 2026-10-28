export type ManagedUserRole = "STUDENT" | "MENTOR";
export type ManagedUserStatus =
  | "ACTIVE"
  | "SUSPENDED"
  | "PENDING_APPROVAL"
  | "APPROVED";

export interface ManagedUser {
  id: string;
  fullName: string;
  email: string;
  role: ManagedUserRole;
  status: ManagedUserStatus;
  createdAt: string;
  profileImageUrl: string | null;
}

export interface UserListParams {
  search?: string;
  role?: ManagedUserRole;
  status?: ManagedUserStatus;
  year?: number;
  page: number;
  limit: number;
}

export interface PaginatedUsers {
  users: ManagedUser[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
