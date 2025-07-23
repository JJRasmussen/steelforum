/*
  Warnings:

  - A unique constraint covering the columns `[usernameLowerCase]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `usernameLowerCase` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Profile_username_key";

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "usernameLowerCase" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Profile_usernameLowerCase_key" ON "Profile"("usernameLowerCase");
