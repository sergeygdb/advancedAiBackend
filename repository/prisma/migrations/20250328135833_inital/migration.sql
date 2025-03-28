/*
  Warnings:

  - Added the required column `brokeSubject` to the `Mistake` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Mistake" ADD COLUMN     "brokeSubject" BOOLEAN NOT NULL;
