const express = require("express");
const router = express.Router();
const Movie = require("../schemas/movie")

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
    const movie = await Movie.find();
    res.status(200).json({ msg: "메인 페이지를 불러옵니다:", movie })
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
        const movieDetail = await Movie.findOne({movieId: movieId})
        res.status(200).json({msg: "상세페이지를 불러옵니다.", movieDetail})
    } catch(err) {
        console.log(err)
        if(err) {
            res.status(500).json({ msg: "상세페이지를 불러오는데 실패했습니다." })
        }
    }
})

module.exports = router;