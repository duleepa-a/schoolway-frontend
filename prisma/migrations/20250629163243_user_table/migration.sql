/*
  Warnings:

  - You are about to drop the column `surname` on the `UserProfile` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'PARENT', 'SERVICE', 'DRIVER', 'TEACHER');

-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "surname",
ADD COLUMN     "lastname" TEXT,
ADD COLUMN     "role" "UserRole";
