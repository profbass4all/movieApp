const messages = require('../messages')
const {sequelize} = require('../models')
const movie = require('../models/movie')(sequelize, require('sequelize').DataTypes);
const showtime = require('../models/showtime')(sequelize, require('sequelize').DataTypes);
const {validateShowtime, validateUpdateShowtime} = require('../validations/showTime.validation')
const Redis = require('redis')
const redis_client = Redis.createClient();
const cron = require('node-cron');
const { Op } = require('sequelize');

//this function creates a showtime by an admin only
const createShowTime =async (req, res) =>{
    try {
        const {showtime_date, movie_id, showtime_capacity, seats_available} = req.body

        const refinedDate = new Date(showtime_date)
        
        if(refinedDate.getTime() < Date.now()) throw new Error( messages.ERROR_OCCURED)
        const {error} = validateShowtime({movie_id: movie_id, showtime_date: refinedDate})
        if(error != undefined) throw new Error(error.details[0].message)
    
        const showtimeCreated = await showtime.create(
            {
                movie_id: movie_id, 
                showtime_date: showtime_date, 
                showtime_capacity:showtime_capacity, 
                seats_available: seats_available
            });

        res.status(201).json({
            message: messages.SHOWTIME_CREATED,
            status: 'success',
            data: showtimeCreated
        })


    } catch (error) {
        res.status(500).json({
            message: error.message,
            status: 'failure'
        })
    }
}

//this function updates a showtime by an admin only
const updateShowTime = async (req, res) => {
    try {
        
        const {error} = validateUpdateShowtime(req.body)
        if(error!= undefined) throw new Error(error.details[0].message)

        await showtime.update(req.body, {where: {showtime_id: req.params.showtime_id}})

        res.status(200).json({
            message: messages.SHOWTIME_UPDATED,
            status:'success'
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
            status: 'failure'
        })
    }
}

//this function gets the movie and all its details
const getMoviesAndShowtimes = async (req, res) => {
    try {

        if(!redis_client.isOpen){
            await redis_client.connect()
        }

        let date = req.query.date

        let year, month, day

        if(date != undefined){

            date = new Date(date)
            year = date.getFullYear()
            month = date.getMonth() + 1
            day = date.getDate()
        }
        
        const cached_movie_list = await redis_client.get(`moviesAndShowtimes${year}${month}${day}`)

        if(!cached_movie_list){
        
            if( date == undefined ){

                const movies = await sequelize.query(

                `SELECT m.title, m.description, m.genre, m.duration, m.poster_image, s.showtime_date, s.showtime_capacity, s.seats_available
                    FROM movies m
                JOIN showtimes s ON m.movie_id = s.movie_id WHERE s.is_valid = true`,
                {
                    type: sequelize.QueryTypes.SELECT
                });

            await redis_client.set('moviesAndShowtimes', JSON.stringify(movies));

            if(movies.length == 0) throw new Error(messages.NO_SHOWTIMES_FOUND)
            
            return res.status(200).json({
                status:'success',
                messages: messages.MOVIES_FETCHED_SUCCESS,
                data: movies,
            })
            }else{
                const movies = await sequelize.query(
                    `SELECT m.title, m.description, m.genre, m.duration, m.poster_image, s.showtime_date, s.showtime_capacity, s.seats_available
                        FROM movies m
                        JOIN showtimes s ON m.movie_id = s.movie_id 
                    WHERE s.showtime_date::DATE = :showtimeDate`,
                    {
                        type: sequelize.QueryTypes.SELECT,
                        replacements: { showtimeDate: `${year}-${month}-${day}` }
                    });

                await redis_client.set(`moviesAndShowtimes${year}${month}${day}`, JSON.stringify(movies));
                return res.status(200).json({
                status:'success',
                messages: messages.MOVIES_FETCHED_SUCCESS,
                data: movies,
            })
            }
            
        }else{
            return res.status(200).json({
                status:'cached success',
                messages: messages.MOVIES_FETCHED_SUCCESS,
                data: JSON.parse(cached_movie_list)
            })
        }
        
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            status: 'failure'
        })
    }
}

cron.schedule('0 0 * * *', async()=>{
    let today = new Date()

    await showtime.update({is_valid: false}, {
        where: {
            showtime_date: {
                [Op.lt]: today
            }
        }
    })
})



module.exports = {createShowTime, updateShowTime, getMoviesAndShowtimes}