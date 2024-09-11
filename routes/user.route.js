const express = require('express');
const router = express.Router();
const {createUser, verifyUser, login, updateUser } = require('../controllers/user.controller')
const authentication = require('../middlewares/authentication');
const authorization = require('../middlewares/authorization');


router.post('/api/user', createUser)

router.post('/api/verifyUser', verifyUser)

router.post('/api/login', login)

router.patch('/api/updateUser', authentication, authorization(['admin', 'user']), updateUser)

module.exports = router