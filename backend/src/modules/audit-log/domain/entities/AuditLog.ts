export const AuditAction = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  USER_CREATED: "USER_CREATED",
  USER_UPDATED: "USER_UPDATED",
} as const;

export type AuditAction = (typeof AuditAction)[keyof typeof AuditAction];

export type AuditLogJsonValue =
  | string
  | number
  | boolean
  | null
  | AuditLogJsonValue[]
  | { [key: string]: AuditLogJsonValue };

export interface AuditLogProps {
  id: string;
  actorId: string | null;
  action: AuditAction;
  description: string | null;
  resourceType: string;
  resourceId: string | null;
  metadata: { [key: string]: AuditLogJsonValue } | null;
  createdAt: Date;
}

export class AuditLog {
  public readonly id: string;
  public readonly actorId: string | null;
  public readonly action: AuditAction;
  public readonly description: string | null;
  public readonly resourceType: string;
  public readonly resourceId: string | null;
  public readonly metadata: { [key: string]: AuditLogJsonValue } | null;
  public readonly createdAt: Date;

  constructor(props: AuditLogProps) {
    this.id = props.id;
    this.actorId = props.actorId;
    this.action = props.action;
    this.description = props.description;
    this.resourceType = props.resourceType;
    this.resourceId = props.resourceId;
    this.metadata = props.metadata;
    this.createdAt = props.createdAt;
  }
}
