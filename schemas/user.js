const mongoose = require("mongoose");
const Joi = require("joi");

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  nickName: {
    type: String,
    required: true,
    unique: true,
  },
  likes: [], 
});

const postUsersSchema = Joi.object({
  userId: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
  nickName: Joi.string().pattern(new RegExp(/^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+$/)).required(),
  password: Joi.string().pattern(new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,20}$/)).required(),
});

const postLoginSchema = Joi.object({
  userId: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
  password: Joi.string().pattern(new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,20}$/)).required(),
});

module.exports = {
  User: mongoose.model("User", UserSchema),
  postUsersSchema,
  postLoginSchema
}