const Joi = require("joi");

const listingSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.object({
        filename: Joi.string().allow("", null),
        url: Joi.string().allow("", null),
    }),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    country: Joi.string().required(),
}).required();

module.exports = listingSchema;