import z from "zod";

const AnswersSchema = z.object({
    answer: z.string(),
    QuestionId : z.string().uuid()
})

export const AnswerPaperSchema = z.object({
    StudentId : z.string().uuid(),
    QPId: z.string().uuid(),
    answers : z.array(AnswersSchema)
})