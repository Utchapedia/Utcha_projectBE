const mongoose = require('mongoose');
const {Schema} = mongoose;

const commentSchema = new Schema 
    ({
      User:{
        type: String,
        required:true,
      },
      userId: {
        type: String,
        required: true,
    },
      postId:{
        type: String,
        required: true,
        trim: true,
      },
      commentId: {
        type: String,
        required: true,
        trim: true,
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
      likes:{
        type: Number,
        default: 0,
      },
    },
    {
      timestamps: true,
    }
  );
  
const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;