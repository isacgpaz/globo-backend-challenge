/*
  Warnings:

  - Added the required column `type` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('MOVIE', 'SERIE');

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "type" "MediaType" NOT NULL;
