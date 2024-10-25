-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "isTeacher" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Teacher" ALTER COLUMN "isTeacher" SET DEFAULT true;
