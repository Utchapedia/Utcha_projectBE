const express = require("express");
const connect = require("./schemas/index");
const cors = require("cors");
const app = express();
const usersRouter = require("./routes/users");
const moviesRouter = require("./routes/movies");
const commentsRouter = require("./routes/comments");
const port = 5000;
require("dotenv").config()

app.use(cors({
    exposedHeaders:["authorization"],
    origin: '*', //출처 허용 옵션: 테스트용 - 전부허용!
    credentials: 'true', // 사용자 인증이 필요한 리소스(쿠키..등) 접근
  }));

connect();

app.use(express.static("static"));
app.use(express.json()); // json형태의 데이터를 parsing하여 사용할 수 있게 만듦.
app.use(express.urlencoded({extended:false}));
app.use("/users", [usersRouter]);
app.use("/movies", [moviesRouter]);
app.use("/comments", [commentsRouter]);

app.listen(port, () => {
    console.log(port, "포트로 서버가 켜졌습니다.");
  });
