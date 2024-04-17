const express = require("express");
const multer = require("multer");
const mysql = require("mysql");
const cors = require("cors");
const app = express();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // cb 콜백함수를 통해 전송된 파일 이름 설정
  },
});

const upload = multer({ storage: storage });

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Apple12!!",
  database: "weather",
});
db.connect();

app.use(cors());
app.use(express.json());

app.post("/create", upload.single("image"), (req, res) => {
  const { name, title, posting } = req.body;
  const image = req.file.filename; // 이미지 파일명
  console.log("req입니다:", req);
  console.log("req.body입니다:", req.body);
  console.log("image입니다:", image);
  //   res.send("올렸습니다 :" + req.file);
  console.log(req.file);

  db.query(
    `INSERT INTO topic (name, title, posting, image) VALUES (?, ?, ?, ?)`,
    [name, title, posting, image],
    (error, result) => {
      if (error) {
        throw error;
      }
      res.json(result);
    }
  );
});

app.listen(3001, () => {
  console.log("Node.js 서버가 3001번 포트에서 실행 중입니다.");
});
