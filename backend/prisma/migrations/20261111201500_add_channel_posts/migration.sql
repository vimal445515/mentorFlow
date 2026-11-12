CREATE TYPE "ChannelPostType" AS ENUM (
  'article',
  'video',
  'document'
);
CREATE TYPE "ChannelPostStatus" AS ENUM ('draft', 'published');

CREATE TABLE "ChannelPost" (
  "postId" TEXT NOT NULL,
  "channelId" TEXT NOT NULL,
  "mentorId" TEXT NOT NULL,
  "type" "ChannelPostType" NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT,
  "description" TEXT,
  "category" TEXT,
  "subject" TEXT,
  "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "mediaKey" TEXT,
  "mediaName" TEXT,
  "mediaMimeType" TEXT,
  "thumbnailKey" TEXT,
  "thumbnailName" TEXT,
  "thumbnailMimeType" TEXT,
  "status" "ChannelPostStatus" NOT NULL DEFAULT 'published',
  "viewCount" INTEGER NOT NULL DEFAULT 0,
  "publishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ChannelPost_pkey" PRIMARY KEY ("postId")
);

CREATE INDEX "ChannelPost_channelId_createdAt_idx"
  ON "ChannelPost"("channelId", "createdAt");
CREATE INDEX "ChannelPost_mentorId_createdAt_idx"
  ON "ChannelPost"("mentorId", "createdAt");
CREATE INDEX "ChannelPost_status_idx" ON "ChannelPost"("status");
CREATE INDEX "ChannelPost_type_idx" ON "ChannelPost"("type");

ALTER TABLE "ChannelPost"
  ADD CONSTRAINT "ChannelPost_channelId_fkey"
  FOREIGN KEY ("channelId") REFERENCES "Channel"("channelId")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ChannelPost"
  ADD CONSTRAINT "ChannelPost_mentorId_fkey"
  FOREIGN KEY ("mentorId") REFERENCES "mentorProfile"("mentorId")
  ON DELETE CASCADE ON UPDATE CASCADE;
