/*
  Warnings:

  - A unique constraint covering the columns `[telegramPostId]` on the table `Post` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "telegramPostId" TEXT;

-- AlterTable
ALTER TABLE "TelegramPost" ADD COLUMN     "postId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Post_telegramPostId_key" ON "Post"("telegramPostId");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_telegramPostId_fkey" FOREIGN KEY ("telegramPostId") REFERENCES "TelegramPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;
