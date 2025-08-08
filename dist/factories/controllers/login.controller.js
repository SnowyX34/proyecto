"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = void 0;
const express_validator_1 = require("express-validator");
const user_model_1 = __importDefault(require("../../infrestructure/orm/models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const loginUser = async (req, res) => {
    var _a;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ msg: "Datos inválidos", errors: errors.array() });
        return;
    }
    const { email, password } = req.body;
    const user = await user_model_1.default.findOne({ where: { email: email } });
    if (!user) {
        res.status(400).json({
            msg: `Ha ocurrido un problema, vuelve a intentar`
        });
        return;
    }
    const passwordValid = await bcryptjs_1.default.compare(password, user.password);
    if (!passwordValid) {
        res.status(400).json({
            msg: "La contraseña o correo ingresada es incorrecta"
        });
        return;
    }
    const token = jsonwebtoken_1.default.sign({
        user_id: user.user_id, // ✅ Usar user_id en lugar de email
        email: user.email,
        role: user.role,
        username: user.user_name, // ✅ Cambiar a user_name
        user_secondName: user.user_secondName, // ✅ Agregar apellido
        avatarUrl: user.avatarUrl // ✅ Esto ya está correcto
    }, (_a = process.env.SECRET_KEY) !== null && _a !== void 0 ? _a : 'ulisesfloresmtz', {
        expiresIn: '1h'
    });
    res.json({ token });
};
exports.loginUser = loginUser;
