export const cookbookSchema = Joi.object({
    madeByOwner: Joi.array().items(Joi.string()).required(), // array of ids
    favorites: Joi.array().items(Joi.string()).required() // array of ids
})