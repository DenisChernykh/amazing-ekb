-- CreateTable
CREATE TABLE "TelegramPost" (
    "message_id" BIGINT NOT NULL,
    "text" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "media_type" TEXT,

    CONSTRAINT "TelegramPost_pkey" PRIMARY KEY ("message_id")
);
