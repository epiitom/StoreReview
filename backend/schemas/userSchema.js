const { z } = require('zod');

// User registration schema
const UserRegistrationSchema = z.object({
  name: z.string()
    .min(5, 'Name must be at least 5 characters')
    .max(60, 'Name must be 60 characters or less')
    .trim(),
  email: z.string()
    .email('Invalid email format')
    .toLowerCase(),
  password: z.string()
    .min(6, 'Password must be at least 6 characters'),
  address: z.string()
    .max(400, 'Address must be 400 characters or less')
    .optional(),
  role: z.enum(['admin', 'normal_user', 'store_owner'])
    .default('normal_user')
});

// User login schema
const UserLoginSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .toLowerCase(),
  password: z.string()
    .min(1, 'Password is required')
});

// Password update schema
const PasswordUpdateSchema = z.object({
  email: z.string()
    .email('Invalid email format'),
  currentPassword: z.string()
    .min(1, 'Current password is required'),
  newPassword: z.string()
    .min(6, 'New password must be at least 6 characters')
});

module.exports = {
  UserRegistrationSchema,
  UserLoginSchema,
  PasswordUpdateSchema
};