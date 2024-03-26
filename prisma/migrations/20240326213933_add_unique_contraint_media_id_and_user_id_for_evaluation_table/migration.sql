/*
  Warnings:

  - A unique constraint covering the columns `[mediaId,userId]` on the table `Evaluation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Evaluation_mediaId_userId_key" ON "Evaluation"("mediaId", "userId");
