"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = void 0;
const express_validator_1 = require("express-validator");
const user_model_1 = __importDefault(require("../../infrestructure/orm/models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const registerUser = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { user_name, password, user_secondName, email, phone_number, role } = req.body;
    const avatarUrl = req.file
        ? `/uploads/${req.file.filename}`
        : `/uploads/default-user.png`;
    //Validamos si el usuario existe en la base de datos
    const user = await user_model_1.default.findOne({ where: { email: email } }); // seria lo mismo que SELECT * FROM USER WHERE USER_NME = PARAMETRO
    if (user) {
        res.status(400).json({
            msg: 'La contraseña o correo ingresada es incorrecta'
        });
        return;
    }
    const hashedpassword = await bcryptjs_1.default.hash(password, 10);
    if (!user_name || !user_secondName || !email || !password || !phone_number) {
        res.status(400).json({ msg: "Todos los campos son obligatorios" });
        return;
    }
    try {
        await user_model_1.default.create({
            user_name: user_name,
            password: hashedpassword,
            user_secondName,
            email,
            phone_number,
            role,
            avatarUrl
        });
        res.json({
            msg: `User ${user_name} created succesfully` //Para que funcione la agregacionde la vriable por ${} es obligtorio usar las comills del tipo ``
        });
    }
    catch (error) {
        res.status(400).json({
            msg: 'An error haas been ocurred',
            error
        });
    }
};
exports.registerUser = registerUser;
