const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth-middleware");
const Counters = require("../schemas/counter");
const Comments = require("../schemas/comment");
const User = require("../schemas/user");

// <---댓글 작성 API-->
// 댓글은 '어디에 달린 댓글인지' 즉 원글이 중요하기 때문에 postId를 함께 DB에 저장합니다.
router.post('/:postId', auth, async (req, res) => {
  const { postId } = req.params;
  const nickName = res.locals.user.nickName;    
  const { comment } = req.body;    
  const createdAt = new Date();

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
      postId,
      comment,
      nickName,
      createdAt,
  });

  res.json({ writtenComment,  message: '댓글을 작성했습니다.' });
});


// <---댓글 조회 API-->
router.get("/:postId", async (req, res) => { 
  //원하는 commentId가 포함된 내용을 찾아온다. 
  const { postId } = req.params; const comment = 
  await Comments.find({postId: postId });
  res.json({ comment : comment }); });


// <---댓글 삭제 API-->
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


// <---댓글 수정 API-->
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


// <---좋아요 API-->
router.post("/like/:commentId", auth, async (req, res) => {
    // 변수 UserLikesArray에, 해당 유저가 지금까지 좋아요 한 글들의 commentId를 모아놓은 [배열] user.likes를 user DB에서 가져와 할당한다.
    const { user } = res.locals;
    let UserLikesArray = user.likes;
  
    // 변수 commentLikes에, 지금 좋아요 또는 좋아요 해제 하려는 글에 지금까지 좋아요 갯수가 몇 개인지 불러온다.
    const { commentId } = req.params;
    const comment = await Comments.findOne({ commentId: commentId }); 
    let commentLikes = comment["likes"];
  
    // 좋아요 해제를 실행한다! UserLikesArray에 이미 좋아요 하려는 글의 commentId가 포함되어 있다면.
    // 1) UserLikesArray에서 현재 글의 commentId를 제거해주고 2)현재 글의 likes 숫자를 하나 줄여준다.
    if (UserLikesArray.includes(commentId)) {
      const likes = UserLikesArray.filter((item) => item !== commentId);
      await User.updateOne({ userId: user.userId }, { $set: { likes } });
  
      commentLikes--;
      await Comments.updateOne({ commentId }, { $set: { likes: commentLikes } });
  
      res.status(200).json({ message: "좋아요 취소" });
  
  
  
    // 좋아요를 실행한다! UserLikesArray에 아직 좋아요 하려는 글의 commentId가 없다면.
    // 1) UserLikesArray에서 현재 글의 commentId를 추가해주고 2)현재 글의 likes 숫자를 하나 더해준다.
  
    } else {
      UserLikesArray.push(commentId);
      await User.updateOne(
        { userId: user.userId },
        { $set: { likes: UserLikesArray } }
      );
  
      commentLikes++;
      awaitComments.updateOne({ commentId }, { $set: { likes: commentLikes } });
      res.status(200).json({ message: "좋아요" });
    }
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