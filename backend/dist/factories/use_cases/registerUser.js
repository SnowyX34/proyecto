"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUserUseCase = void 0;
const userRepoImpl_1 = require("../../infrestructure/repositories/userRepoImpl");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const registerUserUseCase = async (data) => {
    const { email, password, phone_number, role, avatarUrl, ...rest } = data;
    const existing = await userRepoImpl_1.userRepository.getByEmail(email);
    if (existing)
        return { status: 400, payload: { msg: 'Usuario ya existe' } };
    const hashed = await bcryptjs_1.default.hash(password, 10);
    const user = await userRepoImpl_1.userRepository.create({
        ...rest,
        email,
        password: hashed,
        phone_number,
        role,
        avatarUrl,
    });
    return { status: 200, payload: { msg: 'Usuario registrado', user } };
};
exports.registerUserUseCase = registerUserUseCase;
