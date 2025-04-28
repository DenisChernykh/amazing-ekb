-- DropForeignKey
ALTER TABLE "Photo" DROP CONSTRAINT "Photo_telegramPostId_fkey";

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_telegramPostId_fkey" FOREIGN KEY ("telegramPostId") REFERENCES "TelegramPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
