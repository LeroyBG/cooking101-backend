export const userSchema = Joi.object({
    name: Joi.string().required(), // impose length requirements?
    password: Joi.string().required(), // same thing
    cookbook: Joi.string().required() // placeholder: should be id of a cookbook
})