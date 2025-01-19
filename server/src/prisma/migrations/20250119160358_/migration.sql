/*
  Warnings:

  - A unique constraint covering the columns `[vendor,name]` on the table `Part` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Part_vendor_name_key" ON "Part"("vendor", "name");
