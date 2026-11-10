import type { ChannelStatus } from "../enums/ChannelStatus.ts";

export interface ChannelProps {
  channelId?: string;
  mentorId: string;
  name: string;
  category: string;
  topic: string;
  description: string;
  tags: string[];
  status: ChannelStatus;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Channel {
  readonly channelId?: string;
  readonly mentorId: string;
  readonly name: string;
  readonly category: string;
  readonly topic: string;
  readonly description: string;
  readonly tags: string[];
  readonly status: ChannelStatus;
  readonly isDeleted: boolean;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;

  constructor(props: ChannelProps) {
    this.channelId = props.channelId;
    this.mentorId = props.mentorId;
    this.name = props.name;
    this.category = props.category;
    this.topic = props.topic;
    this.description = props.description;
    this.tags = [...props.tags];
    this.status = props.status;
    this.isDeleted = props.isDeleted ?? false;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
