const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth-middleware");
const Counters = require("../schemas/counter");
const Comments = require("../schemas/comment");


//전체 게시글 조회

router.get("/", async (req, res) => {
  //게시글들을 내림차순으로 정렬해서 보여준다.
  const comments = await Comments.find().sort({ createdAt: -1 }); 
  res.json({
    comments,
  });
});

//게시글 상세 조회
router.get("/:commentId", async (req, res) => {
  //원하는 commentId가 포함된 내용을 찾아온다.
  const { commentId } = req.params;
  const [comment] = await Comments.findOne({commentId: commentId }); 
  res.json({
    comment,
  });
});

//게시글 작성
router.post("/", auth, async (req, res) => {
  //작성자의 닉네임을 가지고와 게시글 내용들과 같이 게시한다.
  const {nickName,userId} = res.locals.user; 
  const { content } = req.body; 
  const createdAt = new Date();
 //postId를 카운팅해준다.
  let counter = await Counters.findOne({ name: "Comments" }).exec();
  if (!counter) {
    counter = await Counters.create({ name: "Comments", count: 0 }); 
  }
  counter.count++;
  counter.save();
  let commentId= counter.count;  

  if (!content) {
    return res.status(400).send({
      errorMessage: "코멘트를 입력해주세요.",
    });
  } 

  const createdComments = await Comments.create({
    nickName,
    commentId,
    userId,
    content,
    createdAt,
  }); 

 return res
    .status(201)
    .send({ comments: createdComments, message: "게시글을 작성했습니다." }); 
});

//게시글 수정
router.put("/:commentId", auth, async (req, res) => {
  const {commentId } = req.params;
  const userNickname = res.locals.user.nickName;
  const {content} = req.body;

  const existComment = await Comments.findOne({
    commentId: commentId,
  });

  if (!content) {
    return res.status(400).send({
      errormessage: "작성란을 모두 입력해주세요.",
    });
  }
  
  if (userNickname === existComment['nickName']) {
    //user의 닉네임과 게시글에 포함된 닉네임이 같으면 게시글 수정
    await Comments.updateOne(
      { commentId: commentId },
      { $set: {content } }
    ); 
    res.status(200).send({ message: "게시글을 수정했습니다." });
  } else {
    return res.status(400).send({ errormessage: "자신이 작성한 글만 수정 가능합니다." });
  }
});

//게시글 삭제

router.delete("/:commentId", auth, async (req, res) => {
  const { commentId } = req.params;
  const userNickname = res.locals.user.nickName;
  const comment = await Comments.findOne({ 
    commentId: commentId 
  });
  //user의 닉네임과 게시글에 포함된 닉네임이 같으면 게시글 삭제
  if (userNickname === comment["nickName"]) { 
    await Comments.deleteOne({ 
     commentId: commentId 
    });    
     res.status(200).send({ 
      message: "게시글을 삭제했습니다.", 
    });    
  } else {
    return res.status(401).send({ 
      errormessage: "자신이 작성한 글만 삭제 가능합니다.",
     });    
  }
  
});




module.exports = router;