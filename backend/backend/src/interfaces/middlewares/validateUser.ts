import { body } from 'express-validator';

export const validateUserInput = [
  body('user_name')
    .trim()
    .matches(/^[a-zA-Z0-9]+$/).withMessage("Nombre inválido"),
  body('user_secondName')
    .trim()
    .matches(/^[a-zA-Z0-9]+$/).withMessage("Apellido inválido"),
  body('email')
    .isEmail().withMessage("Debe ser un correo válido"),
  body('password')
    .isLength({ min: 6 }).withMessage("La contraseña debe tener mínimo 6 caracteres")
];

export const validateLogin = [
  body('email').isEmail().withMessage("Correo inválido"),
  body('password').notEmpty().withMessage("Contraseña requerida")
];
