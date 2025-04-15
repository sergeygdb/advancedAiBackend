/*
  Warnings:

  - Made the column `userId` on table `Chat` required. This step will fail if there are existing NULL values in that column.
  - Made the column `chatId` on table `Message` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `VoiceChat` required. This step will fail if there are existing NULL values in that column.
  - Made the column `chatId` on table `VoiceMessage` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_userId_fkey";

-- DropForeignKey
ALTER TABLE "Correction" DROP CONSTRAINT "Correction_voiceMessageId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_chatId_fkey";

-- DropForeignKey
ALTER TABLE "Mistake" DROP CONSTRAINT "Mistake_correctionId_fkey";

-- DropForeignKey
ALTER TABLE "VoiceChat" DROP CONSTRAINT "VoiceChat_userId_fkey";

-- DropForeignKey
ALTER TABLE "VoiceMessage" DROP CONSTRAINT "VoiceMessage_chatId_fkey";

-- AlterTable
ALTER TABLE "Chat" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "chatId" SET NOT NULL;

-- AlterTable
ALTER TABLE "VoiceChat" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "VoiceMessage" ALTER COLUMN "chatId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceChat" ADD CONSTRAINT "VoiceChat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceMessage" ADD CONSTRAINT "VoiceMessage_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "VoiceChat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Correction" ADD CONSTRAINT "Correction_voiceMessageId_fkey" FOREIGN KEY ("voiceMessageId") REFERENCES "VoiceMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mistake" ADD CONSTRAINT "Mistake_correctionId_fkey" FOREIGN KEY ("correctionId") REFERENCES "Correction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
