import Joi from "joi";

export const userSchema = Joi.object({
  name: Joi.string().required(), // impose length requirements?
  password: Joi.string().min(6, "utf-8").required(), // same thing
});
