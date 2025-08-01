/*
  Warnings:

  - You are about to drop the column `classId` on the `Ability` table. All the data in the column will be lost.
  - You are about to drop the column `keywordId` on the `Ability` table. All the data in the column will be lost.
  - You are about to drop the column `tagId` on the `Ability` table. All the data in the column will be lost.
  - You are about to drop the column `tagId` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `threadId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `tagId` on the `Keyword` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `Thread` table. All the data in the column will be lost.
  - You are about to drop the column `commentId` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the column `profileId` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the column `threadId` on the `Vote` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tagID]` on the table `Ability` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tagID]` on the table `Class` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tagID]` on the table `Keyword` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userID]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[profileID,threadID]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[profileID,commentID]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `keywordID` to the `Ability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tagID` to the `Ability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tagID` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorID` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `threadID` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tagID` to the `Keyword` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userID` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorID` to the `Thread` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileID` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Ability" DROP CONSTRAINT "Ability_classId_fkey";

-- DropForeignKey
ALTER TABLE "Ability" DROP CONSTRAINT "Ability_keywordId_fkey";

-- DropForeignKey
ALTER TABLE "Ability" DROP CONSTRAINT "Ability_tagId_fkey";

-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_tagId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_threadId_fkey";

-- DropForeignKey
ALTER TABLE "Keyword" DROP CONSTRAINT "Keyword_tagId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropForeignKey
ALTER TABLE "Thread" DROP CONSTRAINT "Thread_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_commentId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_profileId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_threadId_fkey";

-- DropIndex
DROP INDEX "Ability_tagId_key";

-- DropIndex
DROP INDEX "Class_tagId_key";

-- DropIndex
DROP INDEX "Keyword_tagId_key";

-- DropIndex
DROP INDEX "Profile_userId_key";

-- DropIndex
DROP INDEX "Vote_profileId_commentId_key";

-- DropIndex
DROP INDEX "Vote_profileId_threadId_key";

-- AlterTable
ALTER TABLE "Ability" DROP COLUMN "classId",
DROP COLUMN "keywordId",
DROP COLUMN "tagId",
ADD COLUMN     "classID" TEXT,
ADD COLUMN     "keywordID" TEXT NOT NULL,
ADD COLUMN     "tagID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Class" DROP COLUMN "tagId",
ADD COLUMN     "tagID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "authorId",
DROP COLUMN "parentId",
DROP COLUMN "threadId",
ADD COLUMN     "authorID" TEXT NOT NULL,
ADD COLUMN     "parentCommentID" TEXT,
ADD COLUMN     "threadID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Keyword" DROP COLUMN "tagId",
ADD COLUMN     "tagID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "userId",
ADD COLUMN     "userID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Thread" DROP COLUMN "authorId",
ADD COLUMN     "authorID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "commentId",
DROP COLUMN "profileId",
DROP COLUMN "threadId",
ADD COLUMN     "commentID" TEXT,
ADD COLUMN     "profileID" TEXT NOT NULL,
ADD COLUMN     "threadID" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Ability_tagID_key" ON "Ability"("tagID");

-- CreateIndex
CREATE UNIQUE INDEX "Class_tagID_key" ON "Class"("tagID");

-- CreateIndex
CREATE UNIQUE INDEX "Keyword_tagID_key" ON "Keyword"("tagID");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userID_key" ON "Profile"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_profileID_threadID_key" ON "Vote"("profileID", "threadID");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_profileID_commentID_key" ON "Vote"("profileID", "commentID");

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_authorID_fkey" FOREIGN KEY ("authorID") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorID_fkey" FOREIGN KEY ("authorID") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_threadID_fkey" FOREIGN KEY ("threadID") REFERENCES "Thread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentCommentID_fkey" FOREIGN KEY ("parentCommentID") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_profileID_fkey" FOREIGN KEY ("profileID") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_threadID_fkey" FOREIGN KEY ("threadID") REFERENCES "Thread"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_commentID_fkey" FOREIGN KEY ("commentID") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ability" ADD CONSTRAINT "Ability_classID_fkey" FOREIGN KEY ("classID") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ability" ADD CONSTRAINT "Ability_keywordID_fkey" FOREIGN KEY ("keywordID") REFERENCES "Keyword"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ability" ADD CONSTRAINT "Ability_tagID_fkey" FOREIGN KEY ("tagID") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Keyword" ADD CONSTRAINT "Keyword_tagID_fkey" FOREIGN KEY ("tagID") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_tagID_fkey" FOREIGN KEY ("tagID") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
