const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth-middleware");
const Counters = require("../schemas/counter");
const Comments = require("../schemas/comment");
const Like = require("../schemas/like")
const Movie = require("../schemas/movie");

// 검색 ( 카테고리, title 기준 )
router.get("/", async (req, res) => {
    const keyword = req.query.search.replace(/\s/gi, "");
    const postings = await Movie.find(
        {
            $or: [
                { category: new RegExp(keyword) },
                { title: new RegExp(keyword) },
            ],
        },
        { donator: 0, creatorImg: 0 }
    );
    res.json({
        result: true,
        matchedProjects: postings,
    });
});

// 댓글 작성 API
// 댓글은 '어디에 달린 댓글인지' 즉 원글이 중요하기 때문에 movieId를 함께 DB에 저장합니다.
router.post('/:movieId', auth, async (req, res) => {
  const { movieId} = req.params;
  const nickName = res.locals.user.nickName;    
  const { comment } = req.body;    
  const createdAt = new Date();
  let countLikes =0;

  if (!comment) {
      return res.status(400).json({            
          errorMessage: '작성란을 채워주세요.',
      });
  }
  //commentId 자동 카운팅
  let counter = await Counters.findOne({ name: 'Comments' }).exec();
  if (!counter) {
      counter = await Counters.create({ name: 'Comments', count: 0 });
  }
  counter.count++;
  counter.save();
  let commentId = counter.count;

  const writtenComment = await Comments.create({
      commentId,
      movieId,
      comment,
      nickName,
      createdAt,
      countLikes
  });

  res.json({ writtenComment,  message: '댓글을 작성했습니다.' });
});


// 댓글 조회 API
router.get("/:movieId", async (req, res) => { 
  //원하는 commentId가 포함된 내용을 찾아온다. 
  const { movieId } = req.params; const comment = 
  await Comments.find({movieId: movieId });
  res.json({ comment : comment }); });


// 댓글 삭제 API
router.delete('/:commentId', auth, async (req, res) => {
  const { commentId } = req.params;
  const comment = await Comments.findOne({ commentId: commentId });
  let nickName = res.locals.user.nickName;
  
  if (nickName === comment['nickName']) {
      await Comments.deleteOne({ commentId: commentId });
  } else {
      return res.status(401).json({         
          errorMessage: '작성자만 삭제할 수 있습니다.',
      });
  }

  res.json({ message: '댓글을 삭제하였습니다.' });
});


// 댓글 수정 API
router.put('/:commentId', auth, async (req, res) => {
  const { commentId } = req.params;
  const original_comment = await Comments.findOne({ commentId: commentId });
  const { comment } = req.body;
  let nickName = res.locals.user.nickName;
  
  if (!original_comment) {
      return res.status(400).json({            
          errorMessage: '작성란을 채워주세요.',
      });
  }

  if (nickName === original_comment['nickName']) {
      await Comments.updateOne(
          { commentId: commentId },
          { $set: { comment } }
      );
  } else {
      return res.status(401).json({            
          errorMessage: '작성자만 수정할 수 있습니다.',
      });
  }

  res.json({ message: '댓글을 수정했습니다.' });
});


// 좋아요 추가 기능
router.post('/likes/:commentId', auth, async (req, res) => {
    const { userId } = res.locals.user
    const { commentId } = req.params
    const isLike = await Like.findOne({ userId:userId,commentId})
    if (isLike) {
        return res
            .status(400)
            .json({ errorMessage: '이미 좋아요 되어있는 상태입니다.' })
    } else {
        await Like.create({userId,commentId })
        const existLikes = await Comments.findOne({commentId:commentId})
        if (existLikes) {
            const countLikes = existLikes.countLikes + 1
            await Comments.updateOne(
                { commentId: commentId },
                { $set: { countLikes } }
            )
        }
    }
    res.status(201).json({ message: '좋아요 추가 되었습니다.' })
})

// 좋아요 제거 기능
router.delete('/likes/:commentId',auth,
    async (req, res) => {
        const { userId } = res.locals.user
        const { commentId } = req.params
        const isLike = await Like.findOne({ commentId, userId })
        if (!isLike) {
            return res
                .status(400)
                .json({ errorMessage: '이미 좋아요 되어있지 않은 상태입니다.' })
        } else {
            await Like.deleteOne({ userId, commentId })
            const existLikes = await Comments.findOne({ commentId: commentId })
            if (existLikes) {
                const countLikes = existLikes.countLikes - 1
                await Comments.updateOne(
                    { commentId: commentId },
                    { $set: { countLikes } }
                )
            }
        }
        res.status(201).json({ message: '좋아요 취소 되었습니다.' })
    }
)

router.get('/likes/:commentId', async (req, res) => {
    const { commentId } = req.params
    const existLikeUsers = await Like.find({ commentId })
    const likeUsers = existLikeUsers.map((item) => item.userId)
    res.json({ likeUsers })
})
=======
  });
  
  
  // <---좋아요 개수 API-->
  // 특정 글에 대한 좋아요가 몇 개인지만 보여주는 API
  router.get("/like/:commentId", async (req, res) => {
    const { commentId } = req.params;
    const comment = awaitComments.findOne({ commentId: Number(commentId) });
    const likes = comment["likes"];
  
    res.json({
      likes,
    });
  });
module.exports = router;