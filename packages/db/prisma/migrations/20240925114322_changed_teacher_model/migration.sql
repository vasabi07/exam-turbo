/*
  Warnings:

  - Added the required column `isTeacher` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "isTeacher" BOOLEAN NOT NULL;
