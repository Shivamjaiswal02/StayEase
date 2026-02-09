const Joi = require('joi');

module.exports.listingschema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),      // price should be a non-negative number
    location: Joi.string().required(),
    image: Joi.object({
            filename: Joi.string().allow('', null),
            url: Joi.string().allow('', null)
        }).optional()
        .empty(''),
    country: Joi.string().allow('')
});

module.exports.reviewschema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
});