const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth-middleware");
const Post = require("../schemas/post");
const Movie = require("../schemas/movie")
// const aws = require("aws-sdk");
// const multer = require("multer");
// const multerS3 = require("multer-s3");

// const path = require("path");
// aws.config.loadFromPath(__dirname + "/awsconfig.json"); // 사용자 인증 keyId, Secret KeyId
// const s3 = new aws.S3();

// const upload = multer({
//   storage: multerS3({
//     s3: s3, // 사용자 인증권한이 담긴다.
//     bucket: "desklet", // 버킷이름
//     acl: "public-read-write", // 액세스 제어 목록( Access control for the file)
//     key: function (req, file, cb) {
//       const url = path.extname(file.originalname);
//       cb(null, Date.now() + url);
//     },
//   }),
//   limits: {
//     fileSize: 1000 * 1000 * 10,
//   },
// });


router.post("/",async (req, res) => {
    try {
      const { title, genre, country, year, duration, age, description, category, credits, page, posterUrl, originalTitle, videoUrls, galleryUrls, originalName } = req.body; // userId 추가해야합니다.
      const movieExist = await Movie.find().sort("-movieId").limit(1);
      let movieId = 0;
  
      if (movieExist.length) {
        movieId = movieExist[0]["movieId"] + 1;
      } else {
        movieId = 1;
      }
      await Movie.create({
        movieId,title,originalName,posterUrl,
        originalTitle,videoUrls,galleryUrls,
        genre,country,year,duration,age,
        description,credits,category,page
      });
  
      res.json({ msg: "success" });
    } catch (err) {
      console.log(err);
      res.status(500).json()
    }
  });

router.get('/', async(req, res) => {
    try{
    await Movie.find();
    res.status(200).json({ msg: "메인 페이지를 불러옵니다" })
    } catch(err) {
        console.log(err)
        if(err) {
            res.status(500).json({ msg: "메인 페이지를 불러오는데 실패했습니다." });
        }
    }
})

router.get('/:movieId', async(req, res) => {
    try {
        const { movieId } = req.params
        await Movie.findOne({movieId: movieId})
        res.status(200).json({msg: "상세페이지를 불러옵니다."})
    } catch(err) {
        console.log(err)
        if(err) {
            res.status(500).json({ msg: "상세페이지를 불러오는데 실패했습니다." })
        }
    }
})
module.exports = router;