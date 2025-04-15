-- AlterTable
ALTER TABLE "Chat" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "chatId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "VoiceChat" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "VoiceMessage" ALTER COLUMN "chatId" DROP NOT NULL;
