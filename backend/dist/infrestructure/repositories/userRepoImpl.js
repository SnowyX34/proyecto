"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const user_model_1 = require("../orm/models/user.model");
exports.userRepository = {
    async getByEmail(email) {
        const user = await user_model_1.User.findOne({ where: { email } });
        return user;
    },
    async create(userData) {
        return await user_model_1.User.create(userData);
    }
};
