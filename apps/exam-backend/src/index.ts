// access QP and start exam
//cache answers in redis in between 
// on submit store the QP with teacherId studentId QPId Questions and answers as AnswerPaper 
//get answerpaper to teacher's evaluate page.
//submit the evaluated answerpaper 
//reach the user's page.

import express from "express";
import cors from "cors";
import db from "@repo/db";
import cookieParser from "cookie-parser";
import { AnswerPaperSchema } from "./zod";
import jwt from "jsonwebtoken";
const jwt_secret = "ackjsbasjcb";

const app = express();
const port = 8001;
app.use(cors());
app.use(cookieParser());
app.use(express.json());

//get qpId
app.get("/exam/:qpId",async(req,res)=>{
    //check for user-legitimacy
    const qpId = req.params.qpId
    try {
        const qp = await db.qP.findUnique({
            where:{
                id:qpId
            },
            include:{
                Questions: true
            }
        })
        if(!qp){
            return res.json("couldn't find qp");
        }
        return res.json({message: "this is the QP",qp})
    } catch (error) {
        console.log(error)
        return res.json("error while getting QP");
    }
})
//submitting the answerpaper
app.post('/exam/answerpaper',async(req,res)=>{
    //user validation 
    const userId = "123"
    const AP = AnswerPaperSchema.safeParse(req.body);
    if(!AP.success){
        return res.json("wrong schema from the req body");
    }
    try {
        const answerpaper = await db.answerPaper.create({
            data: {
                StudentId: userId,
                QPId : AP.data.QPId
            }
        })
        const answerData = AP.data.answers.map((answer)=>({
            answer: answer.answer,
            QuestionId: answer.QuestionId,
            answerPaperId: answerpaper.id
        }))
        const answers = await db.answer.createMany({
            data: answerData
        })
        return res.json("successfully submitted the answerpaper");
    } catch (error) {
        console.log(error);
        return res.json("cannot save the answerpaper.");
    }
})

app.get("/teacher/answerpapers",async(req,res)=>{
 try {
    const token = req.cookies.token;
    if (!token) {
      return res.json("UnAuthorized user. No token available");
    } else {
      const decoded = jwt.verify(token, jwt_secret);
      if (!decoded) {
        return res.json("UnAuthorized token.");
      }
      const answerpapers = await db.answerPaper.findMany({
        where: {
           QP: {
            //@ts-ignore
            teacherId: decoded.userId
           }
        },
        select: {
            id: true,
            student: {
                select: {
                    id: true,
                    name: true
                }
            },
            QPId: true
        }
      })
      return res.status(200).json({message: "answerpapers that belongs to a teacher",payload: answerpapers})
    }
 } catch (error) {
    return res.status(500).json("error in getting the answerpapers")
 }
})
app.listen(port,()=>{
    console.log(`server is listening on port: ${port}`)
})