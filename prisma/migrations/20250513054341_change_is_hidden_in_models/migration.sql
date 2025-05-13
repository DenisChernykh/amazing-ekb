/*
  Warnings:

  - You are about to drop the column `isHidden` on the `Image` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Image" DROP COLUMN "isHidden";

-- AlterTable
ALTER TABLE "TelegramPost" ADD COLUMN     "isHidden" BOOLEAN NOT NULL DEFAULT false;
