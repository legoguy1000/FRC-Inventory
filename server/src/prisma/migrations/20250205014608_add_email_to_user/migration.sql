/*
  Warnings:

  - You are about to drop the `OAuth` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `notes` on table `Inventory` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `Inventory` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OAuth" DROP CONSTRAINT "OAuth_userId_fkey";

-- AlterTable
ALTER TABLE "Inventory" ALTER COLUMN "notes" SET NOT NULL,
ALTER COLUMN "notes" SET DEFAULT '',
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Part" ALTER COLUMN "location" SET DEFAULT '';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email" TEXT NOT NULL,
ALTER COLUMN "first_name" DROP NOT NULL,
ALTER COLUMN "last_name" DROP NOT NULL;

-- DropTable
DROP TABLE "OAuth";
