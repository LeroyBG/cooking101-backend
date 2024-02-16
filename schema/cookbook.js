import Joi from 'joi'

export const cookbookSchema = Joi.object({
    owner: Joi.string().required(),
    name: Joi.string().min(1, 'utf-8').max(50, 'utf-8').required(),
    recipes: Joi.array().items(Joi.string()).required()
})