/*
  Warnings:

  - You are about to drop the column `correctedSentence` on the `Correction` table. All the data in the column will be lost.
  - Added the required column `correctionOfEntireSentence` to the `Correction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isCorrectSentence` to the `Correction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Correction" DROP COLUMN "correctedSentence",
ADD COLUMN     "correctionOfEntireSentence" TEXT NOT NULL,
ADD COLUMN     "isCorrectSentence" BOOLEAN NOT NULL;
