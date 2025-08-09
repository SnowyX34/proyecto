"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const express_validator_1 = require("express-validator");
const user_model_1 = require("../../infrestructure/orm/models/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const cloudinary_service_1 = require("../../infrestructure/services/cloudinary.service");
const createUser = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ msg: "Datos inválidos", errors: errors.array() });
        return;
    }
    try {
        const { user_name, user_secondName, email, password, phone_number, role } = req.body;
        const existingUser = await user_model_1.User.findOne({ where: { email } });
        if (existingUser) {
            res.status(400).json({ msg: "El usuario ya existe" });
            return;
        }
        let avatarUrl = '/uploads/default-user.png';
        if (req.file && req.file.buffer) {
            const uploadResult = await cloudinary_service_1.CloudinaryService.uploadImage(req.file.buffer, req.file.originalname, 'usuarios');
            avatarUrl = uploadResult.secure_url;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = await user_model_1.User.create({
            user_name,
            user_secondName,
            email,
            password: hashedPassword,
            phone_number,
            role,
            avatarUrl
        });
        res.status(201).json({
            msg: "Usuario creado exitosamente",
            user: newUser
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al registrar el usuario" });
    }
};
exports.createUser = createUser;
