/*
  Warnings:

  - You are about to drop the column `tartDate` on the `mentorExperience` table. All the data in the column will be lost.
  - Added the required column `startDate` to the `mentorExperience` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "mentorExperience" DROP COLUMN "tartDate",
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;
