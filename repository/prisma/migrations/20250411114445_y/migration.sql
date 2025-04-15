/*
  Warnings:

  - You are about to drop the column `role` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `VoiceMessage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "role";

-- AlterTable
ALTER TABLE "VoiceMessage" DROP COLUMN "role";
