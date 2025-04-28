/*
  Warnings:

  - You are about to drop the column `mainPhoto` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `photoUrl` on the `Image` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Image" DROP COLUMN "mainPhoto",
DROP COLUMN "photoUrl",
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "mainImage" BOOLEAN;
