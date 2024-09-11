const Joi = require('joi');

//validate movie input using joi
const validateMovie = (data)=>{
    const schema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        genre: Joi.string().required(),
        duration: Joi.string().required(),
        poster_image: Joi.string().required()
    });

    return schema.validate(data)
}

const validateUpdateMovie = (data)=>{
    const schema = Joi.object({
        title: Joi.string(),
        description: Joi.string(),
        genre: Joi.string(),
        duration: Joi.string(),
        poster_image: Joi.string()
    });

    return schema.validate(data)
}


module.exports = {validateMovie, validateUpdateMovie};