/*
  Warnings:

  - You are about to drop the column `group_id` on the `TelegramPost` table. All the data in the column will be lost.
  - You are about to drop the column `media_type` on the `TelegramPost` table. All the data in the column will be lost.
  - You are about to drop the column `message_id` on the `TelegramPost` table. All the data in the column will be lost.
  - Added the required column `postLink` to the `TelegramPost` table without a default value. This is not possible if the table is not empty.
  - Made the column `text` on table `TelegramPost` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "TelegramPost_message_id_key";

-- AlterTable
ALTER TABLE "TelegramPost" DROP COLUMN "group_id",
DROP COLUMN "media_type",
DROP COLUMN "message_id",
ADD COLUMN     "postLink" TEXT NOT NULL,
ALTER COLUMN "text" SET NOT NULL;

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "filename" TEXT NOT NULL,
    "telegramPostId" TEXT,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_telegramPostId_fkey" FOREIGN KEY ("telegramPostId") REFERENCES "TelegramPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;
