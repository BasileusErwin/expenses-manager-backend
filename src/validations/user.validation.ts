import { check } from 'express-validator';

const registerUser = [
  check('firstName', 'Please enter a firt name').notEmpty().trim(),
  check('lastName', 'Please enter a last name').notEmpty().trim(),
  check('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
  check('password', 'Please enter a password').notEmpty().trim(),
];

const loginUser = [
  check('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
  check('password', 'Please enter a password').notEmpty().trim(),
];

export const userValidation = {
  registerUser,
  loginUser,
};
