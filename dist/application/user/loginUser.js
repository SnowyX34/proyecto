"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserUseCase = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRepoImpl_1 = require("../../infrestructure/repositories/userRepoImpl");
const loginUserUseCase = async ({ email, password }) => {
    const user = await userRepoImpl_1.userRepository.getByEmail(email);
    if (!user)
        return { status: 400, payload: { msg: 'Usuario no encontrado' } };
    const valid = await bcryptjs_1.default.compare(password, user.password);
    if (!valid)
        return { status: 400, payload: { msg: 'Contraseña incorrecta' } };
    const token = jsonwebtoken_1.default.sign({ email: user.email }, process.env.SECRET_KEY || 'secret', { expiresIn: '1h' });
    return { status: 200, payload: { token } };
};
exports.loginUserUseCase = loginUserUseCase;
