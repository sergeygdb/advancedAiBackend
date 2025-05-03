/*
  Warnings:

  - Added the required column `language` to the `VoiceChat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VoiceChat" ADD COLUMN     "language" TEXT NOT NULL;
