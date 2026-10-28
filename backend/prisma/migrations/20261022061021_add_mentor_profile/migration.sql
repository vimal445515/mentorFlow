-- AlterTable
ALTER TABLE "User" ADD COLUMN     "googleId" TEXT,
ALTER COLUMN "passwordHash" DROP NOT NULL,
ALTER COLUMN "profileImageUrl" DROP NOT NULL,
ALTER COLUMN "profileImageUrl" SET DEFAULT '';

-- CreateTable
CREATE TABLE "StudentProfile" (
    "studentId" TEXT NOT NULL,
    "timezone" TEXT,
    "currentGoal" TEXT,
    "bio" TEXT,
    "followingCount" INTEGER NOT NULL DEFAULT 0,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentProfile_pkey" PRIMARY KEY ("studentId")
);

-- CreateTable
CREATE TABLE "mentorProfile" (
    "mentorId" TEXT NOT NULL,
    "headline" TEXT,
    "bio" TEXT,
    "sessionPrice" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "yearsExperience" INTEGER NOT NULL DEFAULT 0,
    "verificationStatus" "Status" NOT NULL DEFAULT 'PENDING_APPROVAL',
    "followerCount" INTEGER NOT NULL DEFAULT 0,
    "averageRating" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "timezone" TEXT,
    "approvedAt" TIMESTAMP(3),

    CONSTRAINT "mentorProfile_pkey" PRIMARY KEY ("mentorId")
);

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentorProfile" ADD CONSTRAINT "mentorProfile_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
