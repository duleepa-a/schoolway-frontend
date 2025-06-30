/*
  Warnings:

  - You are about to drop the column `lastname` on the `UserProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "lastname",
ADD COLUMN     "surname" TEXT;
