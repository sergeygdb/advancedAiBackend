/*
  Warnings:

  - Added the required column `prompt` to the `VoiceMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VoiceChat" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "VoiceMessage" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "prompt" TEXT NOT NULL;
