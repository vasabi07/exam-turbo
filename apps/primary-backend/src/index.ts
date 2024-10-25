import express, { response } from "express";
import cors from "cors";
import db from "@repo/db";
import cookieParser from "cookie-parser";
import { QPSchema, SigninSchema, SignupSchema } from "./zod";
import jwt from "jsonwebtoken";
const app = express();
const port = 8000;
const jwt_secret = "ackjsbasjcb";
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.post("/signup", async (req, res) => {
  const result = SignupSchema.safeParse(req.body);
  if (!result.success) {
    console.log(result.error);
    return res.json("valid inputs weren't provided");
  }
  try {
    const { name, email, password, isTeacher } = result.data;
    let user;
    if (isTeacher) {
      user = await db.teacher.create({
        data: {
          name,
          email,
          password,
        },
      });
    } else {
      user = await db.student.create({
        data: {
          name,
          email,
          password,
        },
      });
    }
    res.status(201).json({ message: "User created succesfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json("error while creating user.");
  }
});

app.post("/signin", async (req, res) => {
  const result = SigninSchema.safeParse(req.body);
  if (!result.success) {
    console.log(result.error);
    return res.json("valid inputs weren't provided");
  }
  try {
    let user;
    const { email, password, isTeacher } = result.data;
    if (isTeacher) {
      user = await db.teacher.findUnique({
        where: {
          email,
        },
      });
    } else {
      user = await db.student.findUnique({
        where: {
          email,
        },
      });
    }
    if (!user || user.password !== password) {
      return res.json("invalid email or password");
    }
    const token = jwt.sign({ userId: user.id }, jwt_secret, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "succesfully signed in", token });
  } catch (error) {
    console.log(error);
  }
});
app.get("/student/personalinfo", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json("UnAuthorized user. No token available");
    } else {
      const decoded = jwt.verify(token, jwt_secret);
      if (!decoded) {
        return res.json("UnAuthorized token.");
      }
      const user = await db.student.findUnique({
        where: {
          //@ts-ignore
          id: decoded.userId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          isTeacher: true,
          teachers: {
            select: {
              teacher: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
          
        },
      });
      if (!user) {
        return res.json("this user doesnt exist");
      }
      return res
        .status(200)
        .json({ message: "here is the personalInfo", payload: user });
    }
  } catch (error) {}
});
app.get("/teacher/personalinfo", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json("UnAuthorized user. No token available");
    } else {
      const decoded = jwt.verify(token, jwt_secret);
      if (!decoded) {
        return res.json("UnAuthorized token.");
      }

      const teacher = await db.teacher.findUnique({
        where: {
          //@ts-ignore
          id: decoded.userId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          isTeacher: true,
          students: {
            select: {
              student: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          },
          QPs: {
            select: {
              id: true
            }
          }
        },
      });
      return res.status(200).json({message: "here is the teacher's personal info",payload:teacher})
    }
  } catch (error) {
    return res.status(500).json("error in finding the personalInfo");
  }
});

app.get("/allTeachers", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json("UnAuthorized user. No token available");
    } else {
      const decoded = jwt.verify(token, jwt_secret);
      if (!decoded) {
        return res.json("UnAuthorized token.");
      }
      const teacher = await db.teacher.findMany({
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
        },
      });
      return res
        .status(200)
        .json({ message: "all the teachers in db", payload: teacher });
    }
  } catch (error) {}
});
//add qps
app.get("/teacher/:teacherId", async (req, res) => {
  try {
    const token = req.cookies.token;
    const teacherId = req.params.teacherId;
    if (!token) {
      return res.json("UnAuthorized user. No token available");
    } else {
      const decoded = jwt.verify(token, jwt_secret);
      if (!decoded) {
        return res.json("UnAuthorized token.");
      }
      const user = await db.student.findUnique({
        where: {
          //@ts-ignore
          id: decoded.userId,
        },
      });
      if (!user) {
        return res.json("this user doesnt exist");
      }
      //get teacher data
      const teacher_info = await db.teacher.findUnique({
        where: {
          id: teacherId,
        },
      });
      if (!teacher_info) {
        return res.json("couldn't get teacher details");
      }
      //checkin if user is subscribed to the teacher
      const isSubscribed = await db.studentTeacher.findUnique({
        where: {
          StudentId_TeacherId: {
            StudentId: user.id,
            TeacherId: teacherId,
          },
        },
      });
      const subscribed = isSubscribed ? true : false;
      const { name, image } = teacher_info;
      //@ts-ignore
      let QPs = [];
      if(subscribed){
        QPs = await db.qP.findMany({
          where: {
            teacherId: teacherId,
          },
        });
      }
      const response = {
        name,
        image,
        subscribed,
        //@ts-ignore
        QPs
      };
      return res.json({
        message: "teacher info with user's subscription status to the teacher",
        response,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// get all exam papers. use this when someone subscribes.
app.get("/teacher/:teacherId/question-papers", async (req, res) => {
  try {
    const teacherId = req.params.teacherId;
    const qps = await db.qP.findMany({
      where: {
        teacherId: teacherId,
      },
    });
    if (!qps) {
      return res.json("teacher currently has no qps");
    }
    return res.json({ message: "these are the qps of this teacher", qps });
  } catch (error) {
    console.log(error);
    return res.json("error while fetching qps.");
  }
});

//create QP
app.post("/teacher/QP", async (req, res) => {
  try {
    const token = req.cookies.token;
    const qp = QPSchema.safeParse(req.body);
    if (!qp.success) {
      console.log(qp.error);
      return res.json("valid inputs weren't provided");
    }
    if (!token) {
      return res.json("UnAuthorized user. No token available");
    } else {
      const decoded = jwt.verify(token, jwt_secret);
      //@ts-ignore
      if (!decoded || !decoded.isTeacher) {
        return res.json("UnAuthorized token.");
      }
      const teacher = await db.teacher.findUnique({
        where: {
          //@ts-ignore
          id: decoded.userId,
        },
      });
      if (!teacher) {
        return res.json("this user doesnt exist");
      }
      const QP = await db.qP.create({
        data: {
          teacherId: qp.data.teacherId,
          Questions: {
            create: qp.data.Questions.map((question) => ({
              question: question.question,
              answer: question.answer ?? null,
            })),
          },
        },
      });
      res.json({ message: "question paper is succesfully created", QP });
    }
  } catch (error) {}
});
//access QP and start exam


app.listen(port, () => {
  console.log(`server is listening on port: ${port}`);
});
