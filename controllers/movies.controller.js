const { validateMovie, validateUpdateMovie} = require('../validations/movieValidation')
const messages = require('../messages')
const {sequelize} = require('../models')
const movie = require('../models/movie')(sequelize, require('sequelize').DataTypes);
const showtime = require('../models/showtime')(sequelize, require('sequelize').DataTypes);
const { Op } = require("sequelize");
const Redis = require('redis')
const redis_client = Redis.createClient();

//function to create a new instance of movie object
const createMovie =async (req, res)=>{

    try {
        
        const {error} = validateMovie(req.body)
        if(error != undefined) throw new Error(error.details[0].message)
        
        await redis_client.del(`movie_list${page}${limit}${search}${offset}`)
        await movie.create(req.body)

        res.status(201).json({
            status:'success',
            message: messages.MOVIE_CREATED
        })
        
    } catch (error) {
        res.status(500).json({
            status: 'failure',
            message: error.message
        })
    }
}
//function to update a movie with movie_id as params
const updateMovie = async(req, res) => {

    try {
        const {error} = validateUpdateMovie(req.body)
        if(error != undefined) throw new Error(error.details[0].message)

        const findMovie = await movie.update(req.body, {where: {movie_id : req.params.movie_id}})
        if(findMovie == null) throw new Error(messages.MOVIE_NOT_AVAILABLE)
    
            res.status(200).json({
            messages: messages.MOVIE_UPDATED,
            status: 'success',
        })
    } catch (error) {
        res.status(500).json({
            messages: error.message,
            status: 'failure',
        })
    }
    
}

//function to delete a movie with movie_id as params
const deleteMovie =async (req, res) => {
        const t =await sequelize.transaction()
    try {
        //delete the movie in showtimes database
        await showtime.destroy({where: {movie_id: req.params.movie_id}, transaction: t})
        
        //delete the movie in movies database
       await movie.destroy({where: {movie_id : req.params.movie_id}, transaction: t})
        
       await t.commit()
        res.status(204).json({
            message: messages.MOVIE_DELETED,
            status:'success',
        })
    } catch (error) {
        await t.rollback()
        res.status(500).json({
            message: error.message,
            status: 'failure',
        })
    }
}

//function gets a single movie
const getMovie = async function(req, res){
    try {
        const findMovie = await movie.findOne({where: {movie_id: req.params.movie_id}})
        if(findMovie == null) throw new Error(messages.MOVIE_NOT_AVAILABLE)

        res.status(200).json({
            status:'success',
            data: findMovie
        })

    } catch (error) {
        res.status(500).json({
            message: error.message,
            status: 'failure',
        })
    }
}

//function to get all movies
const getMovies =async (req, res) => {

    const page = parseFloat(req.query.page) || 1
    const limit = 3
    const offset = limit * (page -1)
    const search = req.query.search

    try {

        if(!redis_client.isOpen){
            await redis_client.connect()
        }
        const cached_movie_list = await redis_client.get(`movie_list${page}${limit}${search}${offset}`)
        if(!cached_movie_list){
        
        const movies = search == undefined ? 
    
        await movie.findAll({
            attributes: ['movie_id', 'title', 'genre', 'description', 'duration'],
            order: [['genre', 'ASC']],
            limit,
            offset
        }):

        await movie.findAll({
            attributes: ['movie_id', 'title', 'genre', 'description', 'duration'],
            where: {
                genre: {
                    [Op.iLike]: `%${search}%`,
                }
            },
            order: [['genre', 'DESC']],
            limit,
            offset
        })
        
        await redis_client.set(`movie_list${page}${limit}${search}${offset}`, JSON.stringify(movies))

        return res.status(200).json({
            status:'success',
            messages: messages.MOVIES_FETCHED_SUCCESS,
            data: movies
        })
        }else{

            
            return res.status(200).json({
                status:'success',
                messages: messages.MOVIES_FETCHED_SUCCESS,
                data:JSON.parse(cached_movie_list)
            })
        }

        
    } catch (error) {
        res.status(500).json({
            message: error.message,
            status: 'failure',
        })
    }

}



module.exports = {
    createMovie,
    updateMovie,
    deleteMovie,
    getMovie,
    getMovies
}