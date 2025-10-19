-- AlterTable
ALTER TABLE "Movie" ADD COLUMN "slogan" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN "resetPasswordExpires" DATETIME;
ALTER TABLE "User" ADD COLUMN "resetPasswordToken" TEXT;
