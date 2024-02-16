import Joi from "joi";
import { stepSchema } from './step'

export const recipeSchema = Joi.object({
    title: Joi.string()
        .min(2, 'utf-8')
        .max(100, 'utf-8')
        .required(),
    image: Joi.any(),
    ingredients: Joi.array()
        .required()
        .items(Joi.string() // validate ingredients themselves
            .min(1, 'utf-8')
            .max(100, 'utf-8')),
    additionalDetails: Joi.string()
        .max(500, 'utf-8'),
    estimatedTime: [ // can be either a number or a tuple (array)
        [
            Joi.number(),
            Joi.array().length(2).items(Joi.number())
        ].required() // i wonder if this will work...
    ],
    yield: Joi.number(),
    notes: Joi.string()
        .min(1, 'utf-8')
        .max(500, 'utf-8')
        .required(),
    steps: Joi.array()
        .items(stepSchema)
        .required(),
    likeNumber: Joi.number().required(),
    favNumber: Joi.number().required(),

    // private stuff, not sure how necessary
    creator: Joi.string().required(), // should be an id
    id: Joi.string().required(),
    // maybe something to store id of people who liked/starred
})