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
    "activeStatus" BOOLEAN NOT NULL DEFAULT true,
    "address" TEXT,
    "birthDate" TIMESTAMP(3),
    "mobile" TEXT,
    "nic" TEXT,
    "nic_pic" TEXT,
    "district" TEXT,
    "dp" TEXT DEFAULT '/Images/male_pro_pic_placeholder.png',

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

-- CreateTable
CREATE TABLE "DriverProfile" (
    "id" TEXT NOT NULL,
    "licenseId" TEXT NOT NULL,
    "licenseExpiry" TIMESTAMP(3) NOT NULL,
    "licenseFront" TEXT,
    "licenseBack" TEXT,
    "policeReport" TEXT,
    "userId" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ratingCount" INTEGER NOT NULL DEFAULT 0,
    "startedDriving" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DriverProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Van" (
    "id" SERIAL NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "licensePlateNumber" TEXT NOT NULL,
    "makeAndModel" TEXT NOT NULL,
    "seatingCapacity" INTEGER NOT NULL,
    "acCondition" BOOLEAN NOT NULL,
    "routeStart" TEXT,
    "routeEnd" TEXT,
    "rBookUrl" TEXT NOT NULL,
    "revenueLicenseUrl" TEXT NOT NULL,
    "fitnessCertificateUrl" TEXT NOT NULL,
    "insuranceCertificateUrl" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" TEXT NOT NULL,
    "haveDriver" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Van_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_email_key" ON "UserProfile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VanService_userId_key" ON "VanService"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DriverProfile_userId_key" ON "DriverProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Van_registrationNumber_key" ON "Van"("registrationNumber");

-- AddForeignKey
ALTER TABLE "VanService" ADD CONSTRAINT "VanService_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverProfile" ADD CONSTRAINT "DriverProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Van" ADD CONSTRAINT "Van_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

