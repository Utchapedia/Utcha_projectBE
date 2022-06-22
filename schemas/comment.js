const mongoose = require('mongoose');
const {Schema} = mongoose;

const commentSchema = new Schema 
    ({
      userId: {
        type: String,
        
    },
      movieId:{
        type: String,
        required: true,
      },
      commentId: {
        type: String,
        required: true,
      },
      
      comment: {
        type: String,
        required: true,
        trim: true,
      },
      nickName: {
        type: String,
        required: true,
        trim: true,
      },
      createdAt: {
        type: String,
        required: true,
        trim: true,
      },
      countLikes: {
        type: Number,
      },
      commentStar: {
        type: Number,
      },
  
     
    },
    {
      timestamps: true,
    }
  );
  
const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;

