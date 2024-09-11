const Joi = require('joi');

//validate user input using joi
const validateShowtime = (data)=>{
    const schema = Joi.object({
        movie_id: Joi.string().required(),
        showtime_date: Joi.date().required(),
        
    });

    return schema.validate(data)
}

const validateUpdateShowtime = (data)=>{
    const schema = Joi.object({
         movie_id: Joi.string(),
        showtime_date: Joi.date()
    });

    return schema.validate(data)
}


module.exports = {validateShowtime, validateUpdateShowtime};