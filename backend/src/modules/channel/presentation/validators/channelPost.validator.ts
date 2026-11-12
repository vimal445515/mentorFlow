import { z } from "zod";
import type { ChannelPostInputDto } from "../../application/dto/ChannelPostInputDto.ts";
import { AppError } from "../../../../shared/errors/appError.ts";
import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";

const commonFields = {
  title: z.string().trim().min(1).max(200),
  tags: z.array(z.string().trim().min(1).max(50)).max(20),
};

const channelPostSchema = z.discriminatedUnion("type", [
  z.object({
    ...commonFields,
    type: z.literal("TEXT"),
    content: z.string().trim().min(1).max(100_000),
  }),
  z.object({
    ...commonFields,
    type: z.literal("VIDEO"),
    description: z.string().trim().min(1).max(5_000),
    category: z.string().trim().min(1).max(100),
  }),
  z.object({
    ...commonFields,
    type: z.literal("DOCUMENT"),
    description: z.string().trim().min(1).max(5_000),
    subject: z.string().trim().min(1).max(200),
  }),
]);

function parseTags(value: unknown): unknown {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value) as unknown;
  } catch {
    throw new AppError("Tags must be a valid JSON array.", HttpStatusCode.BAD_REQUEST);
  }
}

export function parseChannelPostInput(body: unknown): ChannelPostInputDto {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new AppError("Invalid channel post request.", HttpStatusCode.BAD_REQUEST);
  }
  const fields = body as Record<string, unknown>;
  const result = channelPostSchema.safeParse({
    ...fields,
    tags: parseTags(fields.tags),
  });
  if (!result.success) {
    throw new AppError(
      result.error.issues[0]?.message ?? "Invalid channel post details.",
      HttpStatusCode.BAD_REQUEST,
    );
  }
  return result.data;
}
