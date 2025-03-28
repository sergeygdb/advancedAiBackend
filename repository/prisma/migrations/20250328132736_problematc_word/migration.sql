/*
  Warnings:

  - Added the required column `problematicWord` to the `Mistake` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Mistake" ADD COLUMN     "problematicWord" TEXT NOT NULL;
