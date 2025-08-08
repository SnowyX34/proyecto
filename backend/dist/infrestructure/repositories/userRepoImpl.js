"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const user_model_1 = __importDefault(require("../orm/models/user.model"));
exports.userRepository = {
    async getByEmail(email) {
        const user = await user_model_1.default.findOne({ where: { email } });
        return user;
    },
    async create(userData) {
        return await user_model_1.default.create(userData);
    }
};
