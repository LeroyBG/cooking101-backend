export const stepSchema = Joi.object({
    description: Joi.string()
        .min(0, 'utf-8')
        .max(1000, 'utf-8')
        .required(),
    image: Joi.any(),
})