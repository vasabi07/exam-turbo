/*
  Warnings:

  - You are about to drop the column `answer` on the `Question` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[StudentId,QPId]` on the table `AnswerPaper` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Answer_QuestionId_key";

-- DropIndex
DROP INDEX "AnswerPaper_QPId_key";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "answer";

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "name" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" ALTER COLUMN "name" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AnswerPaper_StudentId_QPId_key" ON "AnswerPaper"("StudentId", "QPId");
