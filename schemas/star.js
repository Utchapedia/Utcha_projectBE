const mongoose = require('mongoose')

const starSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    movieId: {
        type: Number,
        required: true,
    },
    stars: {
        type: Number,
        required: true,
    },
})

module.exports = mongoose.model('Star', starSchema)