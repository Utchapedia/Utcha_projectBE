const mongoose = require('mongoose');
const {Schema} = mongoose;

const commentSchema = new Schema 
    ({
      postId: {
        type: String,
        required: true,
        trim: true,
      },
      userId: {
        type: String,
        required: true,
        trim: true,
      },
      content: {
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
    },
    {
      timestamps: true,
    }
  );
  
const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;