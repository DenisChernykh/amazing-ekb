/*
  Warnings:

  - You are about to drop the column `url` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the `Photo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Photo" DROP CONSTRAINT "Photo_telegramPostId_fkey";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "url",
ADD COLUMN     "filename" TEXT,
ADD COLUMN     "photoUrl" TEXT,
ADD COLUMN     "telegramPostId" TEXT;

-- DropTable
DROP TABLE "Photo";

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_telegramPostId_fkey" FOREIGN KEY ("telegramPostId") REFERENCES "TelegramPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
