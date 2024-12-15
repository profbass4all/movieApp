const express = require('express')
const router = express.Router()
const {createMovie, updateMovie, deleteMovie, getMovie, getMovies} = require('../controllers/movies.controller')
const authentication = require('../middlewares/authentication');
const authorization = require('../middlewares/authorization');

router
  .post(
    '/api/movies', 
    authentication, 
    authorization(['admin']), 
    createMovie
)

router.patch('/api/movie/:movie_id', authentication, authorization(['admin']), updateMovie)

router.delete('/api/movie/:movie_id', authentication, authorization(['admin']), deleteMovie)

router.get('/api/movie/:movie_id', authentication, authorization(['admin', 'user']), getMovie)

router.get('/api/movies', authentication, authorization(['admin', 'user']), getMovies)



module.exports = router