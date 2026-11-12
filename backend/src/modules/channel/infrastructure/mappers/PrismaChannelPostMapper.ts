import type { ChannelPost as PrismaChannelPost } from "@prisma/client";
import type { ChannelPost } from "../../domain/entities/ChannelPost.ts";

export class PrismaChannelPostMapper {
  static toDomain(record: PrismaChannelPost): ChannelPost {
    return {
      ...record,
      type:
        record.type === "article"
          ? "TEXT"
          : record.type === "video"
            ? "VIDEO"
            : "DOCUMENT",
    };
  }
}
