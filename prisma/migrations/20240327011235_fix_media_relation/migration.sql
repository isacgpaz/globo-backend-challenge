/*
  Warnings:

  - You are about to drop the column `artistsIds` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `categoriesIds` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `mediaId` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `mediaId` on the `Serie` table. All the data in the column will be lost.
  - You are about to drop the `MediaStats` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MediaStats" DROP CONSTRAINT "MediaStats_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "Movie" DROP CONSTRAINT "Movie_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "Serie" DROP CONSTRAINT "Serie_mediaId_fkey";

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "artistsIds",
DROP COLUMN "categoriesIds",
ADD COLUMN     "movieId" TEXT,
ADD COLUMN     "serieId" TEXT;

-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "mediaId";

-- AlterTable
ALTER TABLE "Serie" DROP COLUMN "mediaId";

-- DropTable
DROP TABLE "MediaStats";

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "Serie"("id") ON DELETE SET NULL ON UPDATE CASCADE;
