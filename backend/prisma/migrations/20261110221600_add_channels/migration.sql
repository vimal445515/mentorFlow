CREATE TABLE "Channel" (
    "channelId" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("channelId")
);

CREATE INDEX "Channel_mentorId_createdAt_idx" ON "Channel"("mentorId", "createdAt");
CREATE INDEX "Channel_mentorId_name_idx" ON "Channel"("mentorId", "name");

ALTER TABLE "Channel"
ADD CONSTRAINT "Channel_mentorId_fkey"
FOREIGN KEY ("mentorId") REFERENCES "mentorProfile"("mentorId")
ON DELETE CASCADE ON UPDATE CASCADE;
