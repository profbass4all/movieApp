const {createShowTime, updateShowTime, getMoviesAndShowtimes} = require('../controllers/showtime.controller')
const express = require('express')
const router = express.Router()
const authentication = require('../middlewares/authentication');
const authorization = require('../middlewares/authorization');



router.post('/api/showtime', authentication, authorization(['admin'],), createShowTime );

router.patch('/api/showtime/:showtime_id', authentication, authorization(['admin'],), updateShowTime );

router.get('/api/showtime', authentication, authorization(['admin', 'user'],), getMoviesAndShowtimes)


module.exports = router;