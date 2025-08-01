/*
  Warnings:

  - You are about to drop the column `threadId` on the `Tag` table. All the data in the column will be lost.
  - You are about to drop the column `tagID` on the `Thread` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Tag" DROP COLUMN "threadId";

-- AlterTable
ALTER TABLE "public"."Thread" DROP COLUMN "tagID";
