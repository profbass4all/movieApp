const messages = require('../messages')

const authorization =(role)=>{
    return async (req, res, next)=>{

        try {

        const {user} = req.params

        if(!user) throw new Error(messages.INVALID_USER , 401)

        //check if the user's role matches the required role
        if(!role.includes(user.role)) throw new Error( messages.UNAUTHORIZED , 403 )

        next()
        } catch (error) {
            res.status(500).json({
                message: error.message,
                status: 'error'
 
            })
        }


    }
}

module.exports = authorization;