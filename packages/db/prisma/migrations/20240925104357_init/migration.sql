-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentTeacher" (
    "StudentId" TEXT NOT NULL,
    "TeacherId" TEXT NOT NULL,

    CONSTRAINT "StudentTeacher_pkey" PRIMARY KEY ("StudentId","TeacherId")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT,
    "QPId" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QP" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,

    CONSTRAINT "QP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnswerPaper" (
    "id" TEXT NOT NULL,
    "StudentId" TEXT NOT NULL,
    "QPId" TEXT NOT NULL,

    CONSTRAINT "AnswerPaper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "QuestionId" TEXT NOT NULL,
    "answerPaperId" TEXT NOT NULL,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_email_key" ON "Teacher"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AnswerPaper_QPId_key" ON "AnswerPaper"("QPId");

-- CreateIndex
CREATE UNIQUE INDEX "Answer_QuestionId_key" ON "Answer"("QuestionId");

-- AddForeignKey
ALTER TABLE "StudentTeacher" ADD CONSTRAINT "StudentTeacher_StudentId_fkey" FOREIGN KEY ("StudentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentTeacher" ADD CONSTRAINT "StudentTeacher_TeacherId_fkey" FOREIGN KEY ("TeacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_QPId_fkey" FOREIGN KEY ("QPId") REFERENCES "QP"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QP" ADD CONSTRAINT "QP_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnswerPaper" ADD CONSTRAINT "AnswerPaper_StudentId_fkey" FOREIGN KEY ("StudentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnswerPaper" ADD CONSTRAINT "AnswerPaper_QPId_fkey" FOREIGN KEY ("QPId") REFERENCES "QP"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_QuestionId_fkey" FOREIGN KEY ("QuestionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_answerPaperId_fkey" FOREIGN KEY ("answerPaperId") REFERENCES "AnswerPaper"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
