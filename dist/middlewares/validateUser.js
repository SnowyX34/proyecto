"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = exports.validateUserInput = void 0;
const express_validator_1 = require("express-validator");
exports.validateUserInput = [
    (0, express_validator_1.body)('user_name')
        .trim()
        .matches(/^[a-zA-Z0-9]+$/).withMessage("Nombre inválido"),
    (0, express_validator_1.body)('user_secondName')
        .trim()
        .matches(/^[a-zA-Z0-9]+$/).withMessage("Apellido inválido"),
    (0, express_validator_1.body)('email')
        .isEmail().withMessage("Debe ser un correo válido"),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 }).withMessage("La contraseña debe tener mínimo 6 caracteres")
];
exports.validateLogin = [
    (0, express_validator_1.body)('email').isEmail().withMessage("Correo inválido"),
    (0, express_validator_1.body)('password').notEmpty().withMessage("Contraseña requerida")
];
