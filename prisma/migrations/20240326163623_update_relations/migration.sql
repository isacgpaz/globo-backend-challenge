/*
  Warnings:

  - You are about to drop the column `mediaId` on the `Artist` table. All the data in the column will be lost.
  - You are about to drop the column `mediaId` on the `Category` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Artist" DROP CONSTRAINT "Artist_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_mediaId_fkey";

-- AlterTable
ALTER TABLE "Artist" DROP COLUMN "mediaId";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "mediaId";

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "artistsIds" TEXT[],
ADD COLUMN     "categoriesIds" TEXT[];

-- CreateTable
CREATE TABLE "_CategoryToMedia" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ArtistToMedia" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToMedia_AB_unique" ON "_CategoryToMedia"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToMedia_B_index" ON "_CategoryToMedia"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ArtistToMedia_AB_unique" ON "_ArtistToMedia"("A", "B");

-- CreateIndex
CREATE INDEX "_ArtistToMedia_B_index" ON "_ArtistToMedia"("B");

-- AddForeignKey
ALTER TABLE "_CategoryToMedia" ADD CONSTRAINT "_CategoryToMedia_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToMedia" ADD CONSTRAINT "_CategoryToMedia_B_fkey" FOREIGN KEY ("B") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArtistToMedia" ADD CONSTRAINT "_ArtistToMedia_A_fkey" FOREIGN KEY ("A") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArtistToMedia" ADD CONSTRAINT "_ArtistToMedia_B_fkey" FOREIGN KEY ("B") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;
