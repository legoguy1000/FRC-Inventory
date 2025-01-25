-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "owner" TEXT,
ADD COLUMN     "retired" BOOLEAN NOT NULL DEFAULT false;
