/*
  Warnings:

  - You are about to drop the column `average` on the `Evaluation` table. All the data in the column will be lost.
  - You are about to drop the column `evaluationId` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the `EvaluationItem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `rate` to the `Evaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Evaluation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EvaluationItem" DROP CONSTRAINT "EvaluationItem_evaluationId_fkey";

-- DropForeignKey
ALTER TABLE "EvaluationItem" DROP CONSTRAINT "EvaluationItem_userId_fkey";

-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_evaluationId_fkey";

-- AlterTable
ALTER TABLE "Evaluation" DROP COLUMN "average",
ADD COLUMN     "comment" TEXT,
ADD COLUMN     "rate" INTEGER NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "evaluationId";

-- DropTable
DROP TABLE "EvaluationItem";

-- CreateTable
CREATE TABLE "MediaStats" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "average" DOUBLE PRECISION NOT NULL,
    "evaluationsCount" INTEGER NOT NULL,

    CONSTRAINT "MediaStats_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaStats" ADD CONSTRAINT "MediaStats_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
