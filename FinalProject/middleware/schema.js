//|====================================================================================================|
//|-------------------------------------------[ INITIALIZATION ]---------------------------------------|
//|====================================================================================================|
import Joi from "joi";
//|====================================================================================================|
//|-------------------------------------------[-USER-SCHEMA-]------------------------------------------|
//|====================================================================================================|
export const userListQuerySchema = Joi.object({
 role: Joi.string().optional(),
 maxAge:Joi.string().optional(),
 minAge:Joi.string().optional(),
 sortBy:Joi.string().optional() 
});
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
export const commentSchema = Joi.object({
  author: Joi.string().required(),
  commentText: Joi.string().required()
});

//|====================================================================================================|
//|-------------------------------------------[-TEST-SCHEMA-]------------------------------------------|
//|====================================================================================================|
export const testSchema = Joi.object({
  description: Joi.string().required(),
  preconditions: Joi.string().required(),
  steps: Joi.string().required(),
  expectedResult: Joi.string().required(),
  actualResult: Joi.string().required()
});

export const testPatchSchema = Joi.object({
  description: Joi.string().optional(),
  preconditions: Joi.string().optional(),
  steps: Joi.string().optional(),
  expectedResult: Joi.string().optional(),
  actualResult: Joi.string().optional()
}).min(1);