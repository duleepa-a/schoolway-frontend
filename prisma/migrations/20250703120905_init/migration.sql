-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'PARENT', 'SERVICE', 'DRIVER', 'TEACHER');

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstname" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastname" TEXT,
    "role" "UserRole",
    "password" TEXT NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VanService" (
    "id" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,
    "contactNo" TEXT NOT NULL,
    "serviceRegNumber" TEXT NOT NULL,
    "businessDocument" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "VanService_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_email_key" ON "UserProfile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VanService_userId_key" ON "VanService"("userId");

-- AddForeignKey
ALTER TABLE "VanService" ADD CONSTRAINT "VanService_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
