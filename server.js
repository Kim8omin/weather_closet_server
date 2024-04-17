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

app.get("/posts", (req, res) => {
  const sql = "SELECT * FROM topic";
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(result);
  });
});

app.delete("/posts/:id", (req, res) => {
  const postId = req.params.id;
  const sql = "DELETE FROM topic Where id = ?";
  db.query(sql, [postId], (err, data) => {
    if (err) return res.json(err);
    return res.json("post has been deletes");
  });
});

app.put("/posts/:id", upload.single("image"), (req, res) => {
  const postId = req.params.id;
  const sql =
    "UPDATE topic SET `name`=?, `title`=?,`posting`=?,`image`=? where id=?";
  // const { name, title, posting } = req.body;
  //   const image = req.file.filename; // 이미지 파일명
  const image = req.file.filename;
  console.log("req입니다:", req);
  console.log("req.body입니다:", req.body);
  console.log("image입니다:", image);
  //   res.send("올렸습니다 :" + req.file);
  console.log(req.file);
  const values = [req.body.name, req.body.title, req.body.posting, image];

  db.query(sql, [...values, postId], (err, data) => {
    if (err) return res.json(err);
    return res.json("updated!!!");
  });
});

app.listen(3001, () => {
  console.log("Node.js 서버가 3001번 포트에서 실행 중입니다.");
});
