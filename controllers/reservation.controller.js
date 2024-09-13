const messages = require('../messages')
const {sequelize} = require('../models')
const reservation = require('../models/reservation')(sequelize, require('sequelize').DataTypes);
const Revenue = require('../models/revenue')(sequelize, require('sequelize').DataTypes);
const showtime = require('../models/showtime')(sequelize, require('sequelize').DataTypes);
const Redis = require('redis');
const { updateShowTime } = require('./showtime.controller');
const redis_client = Redis.createClient();

//this functions creates a new reservation
const createReservation =async (req, res)=>{
    const t = await sequelize.transaction()
    try {
    
    const {showtime_id, seat_id} = req.body
    if(!showtime_id || !seat_id) throw new Error (messages.ERROR_OCCURED)

    const findShowtime = await showtime.findByPk(showtime_id)
    if(!findShowtime) throw new Error(messages.NO_SHOWTIMES_FOUND)
    
    if(findShowtime.is_valid == false) throw new Error(messages.SHOWTIME_EXPIRED)
        
    let today = Date.now()
    let showtimeDate = findShowtime.showtime_date.getTime()
    if(showtimeDate < today) throw new Error(messages.SHOWTIME_EXPIRED)    

    if(parseInt(findShowtime.showtime_capacity) < parseInt(seat_id) ) throw new Error(messages.SEAT_NOT_AVAILABLE)
    
    if(parseFloat(findShowtime.seats_available) == 0) throw new Error(messages.SEAT_ALREADY_BOOKED)
    // check if the seat is already reserved in the same showtime
    const isSeatAvailable = await reservation.findOne({where: {showtime_id: showtime_id, seat_id: seat_id}})
    if(isSeatAvailable != null) throw new Error(messages.SEAT_ALREADY_BOOKED)
    console.log('findSowtime',findShowtime.seats_available)

    // decrease the seats_available in the showtime table

    // const decreaseShowtimeSeats = await showtime.update(
    //     {seats_available: parseFloat(findShowtime.seats_available) - 1},
    //     {
    //         where: {
    //             showtime_id: showtime_id
    //         },
    //         transaction: t
    //     }
    // )
    //better performance code because it updates the value on the db thereby without fetching the data first
    const decreaseShowtimeSeats = await findShowtime.decrement('seats_available', { by: 1 , transaction: t})
    
    const newReservation = await reservation.create({
        showtime_id: showtime_id,
        seat_id: seat_id,
        user_id: req.params.user_id,
        }
        , {transaction: t}
    )
    await redis_client.del('reservations')
    //find the revenue table if there is a record for the revenue generated from the showtime or create one if it doesnt exist
    //this query will return the revenue instance and a boolean indicating if the instance was just created or not
    const [revenueInstance, isCreated] = await Revenue.findOrCreate({
        where: {
            showtime_id: showtime_id
        },
        defaults: {
            price: messages.SHOWTIME_PRICE,
        },
        transaction: t
    })

    // console.log(isCreated)
    //this query increase the the number of tickets sold
    await revenueInstance.increment('number_of_tickets', { by: 1 , transaction: t})

    // update total_revenue in revenue table
    await revenueInstance.increment('total_revenue', { by: messages.SHOWTIME_PRICE, transaction: t})

    await t.commit()
    res.status(201).json({
        message: messages.RESERVATION_SUCCESSFUL,
        status:'success',
        data: newReservation,
        showtimeData: decreaseShowtimeSeats
    })

} catch (error) {
    await t.rollback()
        res.status(500).json({
            message: error.message,
            status: 'failure'
        })
    }
    
}

//this function gets all reservations for all showtimes for the admin only
const getReservations = async (req, res) => {
    try {

        if(!redis_client.isOpen){
            await redis_client.connect()
        }
        const cachedReservation = await redis_client.get('reservations')

        if(cachedReservation){

            return res.status(200).json({
            message: messages.RESERVATIONS_FETCHED,
            status:'success cached',
            data: JSON.parse(cachedReservation),
            })

        }else{

        const reservations = await reservation.findAll()
        if(!reservations) throw new Error(messages.NO_RESERVATIONS_FOUND)
        
        redis_client.set("reservations", JSON.stringify(reservations) )
        return res.status(200).json({
            message: messages.RESERVATIONS_FETCHED,
            status:'success',
            data: reservations
        })


        }
        
    } catch (error) {
        res.status(500).json({
            message: error.message,
            status: 'failure'
        })
    }
}

//this function gets all reservations and its related details by a given user
const getReservation =async (req, res) =>{
    
    try {
        
        const {user_id} = req.params

        const findReservations = await sequelize.query(`
            SELECT 
                u."firstName", u."lastName", 
                u.email, r.reservation_id, 
                r.showtime_id, s.showtime_date, 
                s.showtime_capacity, r.seat_id, 
                m.title, m.description, 
                m.duration, m.genre 
            FROM 
                "Users" u 
            JOIN 
                reservations r ON u.user_id = r.user_id 
            JOIN 
                showtimes s ON s.showtime_id = r.showtime_id 
            JOIN 
                movies m ON m.movie_id = s.movie_id 
            WHERE 
                u.user_id = :userId
            `, {
                replacements: { userId: user_id },
                type: sequelize.QueryTypes.SELECT
            });

    
        if(!findReservations) throw new Error(messages.NO_RESERVATIONS_FOUND)
        res.status(200).json({
            message: messages.RESERVATIONS_FETCHED,
            status:'success',
            data: findReservations
        })
        
    } catch (error) {
        res.status(500).json({
            message: error.message,
            status: 'failure'
        })
    }


}

//this function gets a single reservation by its id
const getSingleReservation = async (req, res) => {
    try {
        const Sreservation = await reservation.findOne({where: {reservation_id: req.params.reservation_id, user_id: req.params.user_id}})
        if(!Sreservation) throw new Error(messages.NO_RESERVATIONS_FOUND)

        res.status(200).json({
            message: messages.RESERVATION_FETCHED,
            status:'success',
            data: Sreservation
        })
    } catch (error) {
        res.status(500).json({}).json({
            message: error.message,
            status: 'failure'
        })
    }
}

//this function cancels a reservation
const cancelReservation = async (req, res) => {
    const t = await sequelize.transaction()
    try {
        const {reservation_id, showtime_id} = req.body;
        if(!reservation_id || !showtime_id) throw new Error (messages.ERROR_OCCURED)

        const findShowtime = await showtime.findOne({
            where: {showtime_id:showtime_id, is_valid: true},
        })
        if(findShowtime == null) throw new Error (messages.ERROR_OCCURED)
        
        await reservation.destroy(
            {
                where: {reservation_id: reservation_id, user_id: req.params.user_id},
                transaction: t
            }
        );

        const increment_seat_available = await findShowtime.increment('seats_available', {by: 1, transaction: t})

        // update total_revenue in revenue table
        const findRevenue = await Revenue.findOne({where: {showtime_id: showtime_id}})

        if(findRevenue == null) throw new Error (messages.ERROR_OCCURED)
        
        await findRevenue.increment('total_revenue', {by: -messages.SHOWTIME_PRICE, transaction: t})

        // update number_of_tickets in revenue table
        await findRevenue.decrement('number_of_tickets', {by: 1, transaction: t})
        //commit the transaction after all operations are done

        await t.commit();

        res.status(204).json({
            message: messages.RESERVATION_CANCELLED,
            status:'success',
            updateShowTime: increment_seat_available
        })

    } catch (error) {

        await t.rollback();

        res.status(500).json({
            message: error.message,
            status: 'failure'
        });
    }
}

//get all available seats_id for a showtime
const getAvailableSeats = async (req, res) => {
        try {
            const {showtime_id} = req.params;
            //get all reserved seats
            const seats = await reservation.findAll(
                {
                    attributes: ['seat_id'], 
                    where: {'showtime_id': showtime_id}
                }
            );
            const {showtime_capacity} = await showtime.findOne({where: {'showtime_id': showtime_id}})
            let reservedSeats = [];
            for(let seatObj of seats){
                reservedSeats.push(seatObj.seat_id);
            }

            let availableSeats = [];
            for(let i = 0; i <= showtime_capacity; i++) {
                if(!reservedSeats.includes(i)){
                    availableSeats.push(i)
                }
            }
            
            if(!seats) throw new Error(messages.NO_SEATS_FOUND)

            res.status(200).json({
                message: messages.SEATS_FETCHED,
                status:'success',
                data: availableSeats
            })
        } catch (error) {
            res.status(500).json({
                message: error.message,
                status: 'failure'
            })
        }
    }

const getRevenues =async (req, res) =>{
    try {
        //get all revenues from the database
        const allRevenues = await Revenue.findAll()
        res.status(200).json({
            message: messages.REVENUE_FETCHED,
            status: 'success',
            data: allRevenues
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
            status: 'failure'
        })
    }
}
module.exports = {
    createReservation,
    getReservations,
    getReservation,
    getSingleReservation,
    cancelReservation,
    getAvailableSeats,
    getRevenues
}