const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
    movieId: {
        type: Number,
    },
    title: {
        type: String,
    },
    originalName: {
        type: String,
    },
    posterUrl: {
        type: String,
    },
    year: {
        type: Number,
    },
    genre: {
        type: String,
    },
    country: {
        type: String,
    },
    originalTitle: {
        type: String,
    },
    duration: {
        type: String,
    },
    age: {
        type: String,
    },
    description: {
        type: String,
    },
    galleryUrls: {
        type: [String],
    },
    videoUrls: [
        {
            title: String,
            url: String,
        },
    ],
    credits: [
        {
            image: String,
            name: String,
            role: String,
        },
    ],
    category: {
        type: [String],
    },
    page: {
		type: Number,
	}
})

module.exports = mongoose.model('Movie', movieSchema, 'movies') //  아직 데이터 없지만 movies라는 collection에 데이터가 있다고 가정