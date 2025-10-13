//|====================================================================================================|
//|-------------------------------------------[ INITIALIZATION ]---------------------------------------|
//|====================================================================================================|
import Joi from "joi";
//|====================================================================================================|
//|-------------------------------------------[-USER-SCHEMA-]------------------------------------------|
//|====================================================================================================|
//|==================================================|
//|---------------[-USER-POST-SCHEMA-]---------------|
//|==================================================|
export const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().trim().min(3).required(),
  givenName: Joi.string().trim().min(1).required(),
  familyName: Joi.string().trim().min(1).required(),
  role: Joi.string()
    .trim()
    .lowercase()
    .valid(
      'developer',
      'quality analyst',
      'business analyst',
      'product manager',
      'technical manager'
    )
    .required()
});

//|==================================================|
//|---------------[-USER-PATCH-SCHEMA-]--------------|
//|==================================================|
export const userPatchSchema = Joi.object({
  password: Joi.string().min(3).optional(),
  fullName: Joi.string().min(1).optional(), // This field is not in POST schema
  givenName: Joi.string().min(1).optional(),
  familyName: Joi.string().min(1).optional(),
  role: Joi.string()
    .valid(
      'developer',
      'quality analyst',
      'business analyst',
      'product manager',
      'technical manager'
    )
    .optional()
}).min(1);

//|==================================================|
//|---------------[-USER-LOGIN-SCHEMA-]--------------|
//|==================================================|
export const userLoginSchema = Joi.object({
  email: Joi.string().email().min(1).required(),
  password: Joi.string().min(3).required()
});
//|====================================================================================================|
//|-------------------------------------------[-BUGS-SCHEMA-]------------------------------------------|
//|====================================================================================================|
export const bugSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    stepsToReproduce: Joi.string().required()
});
export const bugPatchSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  stepsToReproduce: Joi.string()
}).min(1);
export const bugClassifySchema = Joi.object({
  classification: Joi.string().valid('Critical', 'Major', 'Minor', 'Trivial').required()
});
export const bugAssignSchema = Joi.object({
  assignedToUserId: Joi.string().required()
});
export const bugCloseSchema = Joi.object({
  closed: Joi.boolean().required()
});
//|====================================================================================================|
//|------------------------------------------[-COMMENT-SCHEMA-]----------------------------------------|
//|====================================================================================================|

//|====================================================================================================|
//|-------------------------------------------[-TEST-SCHEMA-]------------------------------------------|
//|====================================================================================================|