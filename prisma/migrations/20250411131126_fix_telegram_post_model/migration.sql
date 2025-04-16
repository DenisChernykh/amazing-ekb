/*
  Warnings:

  - You are about to alter the column `message_id` on the `TelegramPost` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "TelegramPost" ALTER COLUMN "message_id" SET DATA TYPE INTEGER;
