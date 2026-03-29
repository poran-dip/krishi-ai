-- CreateEnum
CREATE TYPE "public"."CropStatus" AS ENUM ('PLANTED', 'GROWING', 'READY_FOR_HARVEST', 'HARVESTED', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."ContactMethod" AS ENUM ('EMAIL', 'PHONE', 'WHATSAPP');

-- CreateEnum
CREATE TYPE "public"."FarmType" AS ENUM ('CROP_FARMING', 'MIXED', 'ORGANIC', 'GREENHOUSE');

-- CreateTable
CREATE TABLE "public"."farmers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "avatar" TEXT,
    "revenue" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastSync" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "farmers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."farmer_settings" (
    "id" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "country" TEXT NOT NULL DEFAULT 'IN',
    "primaryContact" "public"."ContactMethod" NOT NULL DEFAULT 'EMAIL',
    "secondaryContact" "public"."ContactMethod",
    "languagePreference" TEXT NOT NULL DEFAULT 'en',
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "equipments" JSONB,
    "farmSize" DOUBLE PRECISION,
    "farmType" "public"."FarmType" NOT NULL DEFAULT 'MIXED',
    "organicCertified" BOOLEAN NOT NULL DEFAULT false,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "pushNotifications" BOOLEAN NOT NULL DEFAULT true,
    "weatherAlerts" BOOLEAN NOT NULL DEFAULT true,
    "marketPriceAlerts" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "farmerId" TEXT NOT NULL,

    CONSTRAINT "farmer_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."crops" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "variety" TEXT,
    "plantedDate" TIMESTAMP(3),
    "harvestDate" TIMESTAMP(3),
    "quantity" DOUBLE PRECISION,
    "status" "public"."CropStatus" NOT NULL DEFAULT 'PLANTED',
    "notes" TEXT,
    "isFuture" BOOLEAN NOT NULL DEFAULT false,
    "farmerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crops_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "farmers_email_key" ON "public"."farmers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "farmer_settings_farmerId_key" ON "public"."farmer_settings"("farmerId");

-- AddForeignKey
ALTER TABLE "public"."farmer_settings" ADD CONSTRAINT "farmer_settings_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "public"."farmers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."crops" ADD CONSTRAINT "crops_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "public"."farmers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
