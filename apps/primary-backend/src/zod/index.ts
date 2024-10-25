import z from "zod"

export const SignupSchema = z.object({
    name: z.string(),
    email:z.string().email(),
    password: z.string().min(5).max(12),
    isTeacher: z.boolean()
})

export const SigninSchema = z.object({
    email:z.string().email(),
    isTeacher : z.boolean(),
    password: z.string().min(5).max(12),
})

const QuestionSchema = z.object({
    question: z.string(),
    answer: z.string().optional(),

})
export const QPSchema = z.object({
    teacherId : z.string().uuid(),
    Questions : z.array(QuestionSchema).min(1)
}) 
