const {validateUser, validateUpdateCustomer} = require('../validations/user.validation')
const { hashPassword, generateOtp, comparePassword } = require('../utils')
const Redis = require('redis')
const redisClient = Redis.createClient()
const {sequelize} = require('../models')
const EXPIRATION_TIME = 1000 * 60 * 10
const messages = require('../messages')
const {sendEmail} = require('../services/email')
const User = require('../models/user')(sequelize, require('sequelize').DataTypes);
const jwt = require('jsonwebtoken');


//this function is used to create a new user
const createUser = async (req, res)=>{

    try {

        //destructure the request body
        const {firstName, lastName, email, password, confirmPassword} = req.body;

        //validate user inputs
        const {error} = validateUser(req.body);
        if(error != undefined) throw new Error(error.details[0].message);

        //hash password 
        const [hash, salt] =await hashPassword(password)
        if(!redisClient.isOpen){
            await redisClient.connect()
        }

        await redisClient.set('newUser', JSON.stringify({firstName, lastName, email, password, hash, salt}))

        //create the otp code
        const otp_code = generateOtp()

        //insert the otp code into the otp table
        await redisClient.setEx('otp', EXPIRATION_TIME, JSON.stringify({email, otp_code, createdAt: Date.now()}))

        //send the otp code to users email address
        sendEmail(email, `verify your email with this otp code ${otp_code }`, 'Email verification')
        
        res.status(201).json({
            status:'success',
            message: messages.CREATE_USER_UNVERIFIED,
        })
        
    } catch (error) {
        res.status(500).json({
            status: 'failure',
            message: error.message
        })
    }
}

const verifyUser = async(req, res)=>{

    try {
        const {email, otp_code} = req.body

        //check if redis is available
        if(!redisClient.isOpen){
            await redisClient.connect()
        }

        //get otp object from redis
        const userOtp = await redisClient.get('otp')

        //check if the userOtp object exists in the database
        if(userOtp === null) throw new Error(messages.EXPIRED_OTP)

        //parse the userOtp object
        const parsedOtp = JSON.parse(userOtp)
        
        //check if the email and otp_code match
        if(parsedOtp.email != email || parsedOtp.otp_code != otp_code){
            throw new Error(messages.EXPIRED_OTP)
        }

        //get user from redis
        const userObj = await redisClient.get('newUser')

        //check if userObj is null
        if(!userObj) throw new Error (messages.EXPIRED_OTP)

        //parse user gotten from redis
        const parsedUser = JSON.parse(userObj)

        //check if the email already exists in the database
        const findUser = await User.
        findOne({
                where: {
                    email: parsedUser.email
                }});
        //if email exists, throw an error
        
        if(findUser != null) throw new Error (messages.USER_EXIST)

        //create the new user
        const newUser = await User.create({
            firstName: parsedUser.firstName,
            lastName: parsedUser.lastName,
            email: parsedUser.email,
            hash: parsedUser.hash,
            salt: parsedUser.salt
        })   

        //send welcome email to the new user
        sendEmail(email, `Your email address has been verified`, 'Verification Success')

        //delete the user from redis
        await redisClient.del("newUser")
        
        //delete the otp from redis
        await redisClient.del('otp')

        //return the new user object
        res.status(201).json({
            message: messages.USER_VERIFIED,
            status:'success',
            data: newUser
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
            status: 'failure'
        });
    }
}

const login = async (req, res) => {
    try{
        //get email and password from the request body
        const {email, password} = req.body;

        //check if email is valid
        const findUser =await User.findOne({where: {email: email}})

        //if user not found, throw an error
        if(!findUser) throw new Error(messages.INVALID_EMAIL_OR_PASSWORD)

        //check if password matches with the hashed password
        const hash =await comparePassword(password, findUser.salt)

        if(hash != findUser.hash) throw new Error(messages.INVALID_EMAIL_OR_PASSWORD)

        //generate a token for the user
        const token = jwt.sign({email: findUser.email}, process.env.JWT_SECRET, {expiresIn: process.env.EXPIRES_IN})


        res.setHeader('accessToken', token)
 
        res.status(200).json({
            message: messages.USER_LOGGED_IN,
            status:'success',
        })
        
}catch(error){
        res.status(500).json({
            message: error.message,
            status: 'failure'
        })
    }
    


};

const updateUser =async (req, res) => {

    try {
        const {user_id} = req.params;

        const {error} = validateUpdateCustomer(req.body);

        if(error != undefined)  throw new Error(error.details[0].message);

        const updateUser = await User.update(req.body, { where:{user_id: user_id} })

        res.status(200).json({
            message: messages.USER_UPDATED,
            status:'success',
            data: updateUser
        })

    } catch (error) {
        res.status(500).json({
            message: error.message,
            status: 'failure'
        })
    }
};

module.exports = { createUser, verifyUser, login, updateUser };