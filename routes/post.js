const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const { afterUploadImage, uploadPost } = require("../controllers/post");

try {
  fs.readdirSync("uploads");
} catch (error) {
  fs.mkdirSync("uploads");
}
// ====================================<이미지 업로드 라우터>====================================
const upload = multer({
  storage: multer.diskStorage({
    // 사용자가 올린 이미지 디스크에 저장
    destination(req, file, cb) {
      // done인데 cb라고 매개변수 명을 정함. 이유는 모름
      cb(null, "uploads/");
    },
    filename(req, file, cb) {
      console.log("file :", file); // 이렇게 각 매개변수에 뭐가 들었는지 찍어보면 된다.
      const ext = path.extname(file.originalname); // 확장자 추출
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext); // 파일 명 추출 + 날짜 + 확장자
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 부족하면 늘리면 됨.
});

router.post("/img", isLoggedIn, upload.single("img"), afterUploadImage);

// ====================================<게시글 업로드 라우터>====================================
const upload2 = multer();

router.post("/", isLoggedIn, upload2.none(), uploadPost);

module.exports = router;
