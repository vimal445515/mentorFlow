import { z } from "zod";
import { ChannelSortBy } from "../../domain/enums/ChannelSortBy.ts";
import { ChannelSortOrder } from "../../domain/enums/ChannelSortOrder.ts";
import { ChannelStatus } from "../../domain/enums/ChannelStatus.ts";
import type { ChannelListQueryDto } from "../../application/dto/ChannelListQueryDto.ts";
import { AppError } from "../../../../shared/errors/appError.ts";
import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";

const channelStatusSchema = z.enum([
  ChannelStatus.ACTIVE,
  ChannelStatus.PRIVATE_DRAFT,
  ChannelStatus.ARCHIVED,
]);

const channelFields = {
  name: z.string().trim().min(1).max(100),
  category: z.string().trim().min(1).max(100),
  topic: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(5000),
  tags: z.array(z.string().trim().min(1).max(50)).max(20).default([]),
};

export const createChannelSchema = z.object({
  ...channelFields,
  status: z.enum([ChannelStatus.ACTIVE, ChannelStatus.PRIVATE_DRAFT]),
});

export const updateChannelSchema = z.object({
  ...channelFields,
  status: channelStatusSchema,
});

const channelListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(1_000_000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(5),
  search: z.string().trim().max(100).optional(),
  status: channelStatusSchema.optional(),
  sortBy: z.enum([ChannelSortBy.NAME, ChannelSortBy.CREATED_AT]).default(
    ChannelSortBy.CREATED_AT,
  ),
  sortOrder: z.enum([ChannelSortOrder.ASC, ChannelSortOrder.DESC]).default(
    ChannelSortOrder.DESC,
  ),
});

export function parseChannelListQuery(query: unknown): ChannelListQueryDto {
  const result = channelListQuerySchema.safeParse(query);
  if (!result.success) {
    throw new AppError(
      result.error.issues[0]?.message ?? "Invalid channel list query.",
      HttpStatusCode.BAD_REQUEST,
    );
  }
  return result.data;
}
