const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: errorMessage
      });
    }
    
    next();
  };
};

// Validation schemas
const authSchemas = {
  register: Joi.object({
    username: Joi.string()
      .min(3)
      .max(30)
      .pattern(/^[a-zA-Z0-9_]+$/)
      .required()
      .messages({
        'string.min': 'Username must be at least 3 characters long',
        'string.max': 'Username cannot exceed 30 characters',
        'string.pattern.base': 'Username can only contain letters, numbers, and underscores',
        'any.required': 'Username is required'
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please enter a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string()
      .min(6)
      .required()
      .messages({
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Password is required'
      }),
    profile: Joi.object({
      firstName: Joi.string().max(50).optional(),
      lastName: Joi.string().max(50).optional(),
      bio: Joi.string().max(500).optional()
    }).optional()
  }),

  login: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please enter a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Password is required'
      })
  })
};

const userSchemas = {
  update: Joi.object({
    username: Joi.string()
      .min(3)
      .max(30)
      .pattern(/^[a-zA-Z0-9_]+$/)
      .optional()
      .messages({
        'string.min': 'Username must be at least 3 characters long',
        'string.max': 'Username cannot exceed 30 characters',
        'string.pattern.base': 'Username can only contain letters, numbers, and underscores'
      }),
    email: Joi.string()
      .email()
      .optional()
      .messages({
        'string.email': 'Please enter a valid email address'
      }),
    profile: Joi.object({
      firstName: Joi.string().max(50).optional(),
      lastName: Joi.string().max(50).optional(),
      bio: Joi.string().max(500).optional(),
      avatar: Joi.string().uri().optional()
    }).optional()
  })
};

const postSchemas = {
  create: Joi.object({
    title: Joi.string()
      .min(3)
      .max(200)
      .required()
      .messages({
        'string.min': 'Title must be at least 3 characters long',
        'string.max': 'Title cannot exceed 200 characters',
        'any.required': 'Title is required'
      }),
    content: Joi.string()
      .min(10)
      .max(10000)
      .required()
      .messages({
        'string.min': 'Content must be at least 10 characters long',
        'string.max': 'Content cannot exceed 10000 characters',
        'any.required': 'Content is required'
      }),
    tags: Joi.array()
      .items(Joi.string().max(20))
      .max(10)
      .optional()
      .messages({
        'array.max': 'Cannot have more than 10 tags',
        'string.max': 'Tag cannot exceed 20 characters'
      }),
    status: Joi.string()
      .valid('draft', 'published', 'archived')
      .optional(),
    isPublic: Joi.boolean().optional(),
    featured: Joi.boolean().optional()
  }),

  update: Joi.object({
    title: Joi.string()
      .min(3)
      .max(200)
      .optional()
      .messages({
        'string.min': 'Title must be at least 3 characters long',
        'string.max': 'Title cannot exceed 200 characters'
      }),
    content: Joi.string()
      .min(10)
      .max(10000)
      .optional()
      .messages({
        'string.min': 'Content must be at least 10 characters long',
        'string.max': 'Content cannot exceed 10000 characters'
      }),
    tags: Joi.array()
      .items(Joi.string().max(20))
      .max(10)
      .optional()
      .messages({
        'array.max': 'Cannot have more than 10 tags',
        'string.max': 'Tag cannot exceed 20 characters'
      }),
    status: Joi.string()
      .valid('draft', 'published', 'archived')
      .optional(),
    isPublic: Joi.boolean().optional(),
    featured: Joi.boolean().optional()
  })
};

module.exports = {
  validate,
  authSchemas,
  userSchemas,
  postSchemas
}; 