-- CreateTable
CREATE TABLE "Correction" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "voiceMessageId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Correction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mistake" (
    "id" SERIAL NOT NULL,
    "explanation" TEXT NOT NULL,
    "correctionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mistake_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Correction" ADD CONSTRAINT "Correction_voiceMessageId_fkey" FOREIGN KEY ("voiceMessageId") REFERENCES "VoiceMessage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mistake" ADD CONSTRAINT "Mistake_correctionId_fkey" FOREIGN KEY ("correctionId") REFERENCES "Correction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
