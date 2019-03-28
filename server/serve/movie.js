const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')

export const getAllMovies = async (type) =>{
    let query={}

    if(type){
        query.movieType ={
            $in:[type]
        }
    }

    const movies = await Movie.find(query)

    return movies
}

export const getMovieDetail = async (id) =>{

    const movie = await Movie.findOne({
        _id:id
    })

    return movie
}

export const getRelativeMovie = async (id) =>{

    const movies = await Movie.find({
        moviesTypes:{
            $in:movie.movie_type
        }
    })

    return movies
}