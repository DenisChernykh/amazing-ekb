/*
  Warnings:

  - A unique constraint covering the columns `[message_id]` on the table `TelegramPost` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "TelegramPost" ADD COLUMN     "group_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "TelegramPost_message_id_key" ON "TelegramPost"("message_id");
