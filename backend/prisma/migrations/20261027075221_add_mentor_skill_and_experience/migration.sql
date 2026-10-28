-- CreateEnum
CREATE TYPE "ProficiencyLevel" AS ENUM ('ADVANCED', 'INTERMEDIATE', 'EXPERT');

-- CreateEnum
CREATE TYPE "EmploymentTypes" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE');

-- CreateEnum
CREATE TYPE "WorkPlaceTypes" AS ENUM ('REMOTE', 'ONSITE', 'HYBRID');

-- CreateTable
CREATE TABLE "mentorSkill" (
    "skillId" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "skillName" TEXT NOT NULL,
    "subtopics" TEXT,
    "proficiencyLevel" "ProficiencyLevel" NOT NULL,

    CONSTRAINT "mentorSkill_pkey" PRIMARY KEY ("skillId")
);

-- CreateTable
CREATE TABLE "mentorExperience" (
    "experienceId" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT,
    "employmentType" "EmploymentTypes" NOT NULL,
    "workPlaceType" "WorkPlaceTypes" NOT NULL,
    "location" TEXT,
    "tartDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,

    CONSTRAINT "mentorExperience_pkey" PRIMARY KEY ("experienceId")
);
