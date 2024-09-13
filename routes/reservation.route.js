const express = require('express')
const router = express.Router()
const authentication = require('../middlewares/authentication');
const authorization = require('../middlewares/authorization');
const {createReservation, getReservations, getReservation, getRevenues,  getAvailableSeats, cancelReservation, getSingleReservation} = require('../controllers/reservation.controller')


router.post('/api/reservation', authentication, authorization(['admin', 'user']), createReservation)

router.get('/api/reservation', authentication, authorization(['admin']), getReservations)

router.get('/api/getReservation',  authentication, authorization(['admin', 'user']), getReservation)

router.get('/api/singleReservation/:reservation_id', authentication, authorization(['admin', 'user']), 
getSingleReservation)

router.delete('/api/cancelReservation', authentication, authorization(['admin', 'user']), cancelReservation)

router.get('/api/seats/:showtime_id',  authentication, authorization(['admin', 'user']), getAvailableSeats)

router.get('/api/getRevenues', authentication, authorization(['admin', 'user']), getRevenues)

module.exports = router;