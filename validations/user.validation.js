const Joi = require('joi');

//validate user input using joi
const validateUser = (data)=>{
    const schema = Joi.object({
        firstName: Joi.string().required().pattern(new RegExp('^[a-zA-Z]+[a-zA-Z]$')),
        lastName: Joi.string().required().pattern(new RegExp('^[a-zA-Z]+[a-zA-Z]$')),
        email: Joi.string().email().required(),
        password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        confirmPassword: Joi.ref('password'),
    });

    return schema.validate(data)
}

const validateUpdateCustomer = (data)=>{
    const schema = Joi.object({
        firstName: Joi.string().pattern(new RegExp('^[a-zA-Z]+[a-zA-Z]$')),
        lastName: Joi.string().pattern(new RegExp('^[a-zA-Z]+[a-zA-Z]$')),
    });

    return schema.validate(data)
}


module.exports = {validateUser, validateUpdateCustomer};