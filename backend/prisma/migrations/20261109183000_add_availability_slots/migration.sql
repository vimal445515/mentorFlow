CREATE TABLE "AvailabilitySlot" (
    "slotId" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,

    CONSTRAINT "AvailabilitySlot_pkey" PRIMARY KEY ("slotId")
);

CREATE UNIQUE INDEX "AvailabilitySlot_mentorId_date_startTime_endTime_key"
ON "AvailabilitySlot"("mentorId", "date", "startTime", "endTime");

CREATE INDEX "AvailabilitySlot_mentorId_date_idx"
ON "AvailabilitySlot"("mentorId", "date");

ALTER TABLE "AvailabilitySlot"
ADD CONSTRAINT "AvailabilitySlot_mentorId_fkey"
FOREIGN KEY ("mentorId") REFERENCES "mentorProfile"("mentorId")
ON DELETE CASCADE ON UPDATE CASCADE;
