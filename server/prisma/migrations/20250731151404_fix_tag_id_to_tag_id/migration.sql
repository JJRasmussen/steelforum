/*
  Warnings:

  - You are about to drop the column `tagId` on the `Thread` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Thread" DROP COLUMN "tagId",
ADD COLUMN     "tagID" TEXT;
