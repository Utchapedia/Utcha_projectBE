const express = require("express");
const router = express.Router();
const Movie = require("../schemas/movie")
const auth = require("../middlewares/auth-middleware");
const Star = require('../schemas/star')



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

// 개인 별점 조회
router.get('/:movieId/stars/mystar', auth, async (req, res) => {
  try {
    const { movieId } = req.params
    const { userId } = res.locals.user
    const existStar = await Star.findOne({ movieId, userId })
    let myStar = 0
    if (!existStar) {
        myStar = 0
    } else {
        myStar = existStar.stars
    }
    res.status(200).json({msg:"개인 별점 조회 완료"})
} catch(err) {
    console.log(err)
    if(err) {
        res.status(500).json({ msg: "개인 별점 조회 실패." })
    }
}

})

// 별점 추가
router.post('/:movieId/stars', auth, async (req, res) => {
  try {
    const { movieId } = req.params
    const { stars } = req.body
    const { userId } = res.locals.user
    const existStar = await Star.findOne({ userId, movieId })
    // 이미 별점이 존재하면 수정
    if (existStar) {
        existStar.stars = stars
        await existStar.save()
        return res.status(201).json({msg:"별점 수정"})
    }
    const star = new Star({ userId, movieId, stars })

    await star.save()

    res.status(200).json({msg:"별점 추가 성공"})
} catch(err) {
    console.log(err)
    if(err) {
        res.status(500).json({ msg: "별점 추가 실패." })
    }
}
})

// 별점 삭제

router.delete('/:movieId/stars', auth, async (req, res) => {

  try {
    const { movieId } = req.params
    const { userId } = res.locals.user
  
    const existStar = await Star.findOne({ userId, movieId })
    if (!existStar) {
        return res.status(400).send()
    }
  
    await Star.deleteOne({ movieId, userId })

    res.status(200).json({msg:"별점 삭제 성공"})
} catch(err) {
    console.log(err)
    if(err) {
        res.status(500).json({ msg: "별점 삭제 실패." })
    }
}
  
})

// 별점 정보 조회
router.get('/:movieId/stars', async (req, res) => {  
  try {
    const { movieId } = req.params
    const allStars = await Star.find({ movieId })
    if (!allStars.length) {
        const averageStar = 0
        const numRatings = 0
        const countsPerStars = [0, 0, 0, 0, 0]
        return res.status(201).json({ averageStar, numRatings, countsPerStars })
    }
  
    const numRatings = allStars.length
    const stars = allStars.map((x) => x.stars)
    const averageStar = stars.reduce((a, b) => a + b) / numRatings
  
    const countsPerStars = []
    for (let i = 1; i <= 5; i++) {
        countsPerStars.push(stars.filter((x) => x === i).length)
    }
    res.status(200).json({ msg:"별점 정보 조회 성공",averageStar, numRatings, countsPerStars })
} catch(err) {
    console.log(err)
    if(err) {
        res.status(500).json({ msg: "별점 정보 조회 실패." })
    }
}
})

module.exports = router;