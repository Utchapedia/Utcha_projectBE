const mongoose = require("mongoose");
require('dotenv').config();

const connect = () => {
  mongoose
  .connect("mongodb+srv://Utcha:8189@cluster0.dkkhb34.mongodb.net/?retryWrites=true&w=majority")
  .catch(err => console.error("db 연결이 되지 않았습니다."));      
};

module.exports = connect;