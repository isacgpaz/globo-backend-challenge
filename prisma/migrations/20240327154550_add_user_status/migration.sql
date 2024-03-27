-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ENABLED', 'BLOCKED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ENABLED';
