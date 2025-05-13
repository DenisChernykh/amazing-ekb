/*
  Warnings:

  - You are about to drop the column `postId` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `publishedAt` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `tgPostUrl` on the `Post` table. All the data in the column will be lost.
  - Made the column `telegramPostId` on table `Post` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_postId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_telegramPostId_fkey";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "postId";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "publishedAt",
DROP COLUMN "tgPostUrl",
ALTER COLUMN "telegramPostId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_telegramPostId_fkey" FOREIGN KEY ("telegramPostId") REFERENCES "TelegramPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
