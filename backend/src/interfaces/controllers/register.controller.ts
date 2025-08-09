import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import {User} from '../../infrestructure/orm/models/user.model';
import bcrypt from 'bcryptjs';
import { CloudinaryService } from '../../infrestructure/services/cloudinary.service';

export const createUser = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ msg: "Datos inválidos", errors: errors.array() });
        return;
    }

    try {
        const {
            user_name,
            user_secondName,
            email,
            password,
            phone_number,
            role
        } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            res.status(400).json({ msg: "El usuario ya existe" });
            return;
        }

        let avatarUrl = '/uploads/default-user.png';

        if (req.file && req.file.buffer) {
            const uploadResult = await CloudinaryService.uploadImage(
                req.file.buffer,
                req.file.originalname,
                'usuarios'
            );

            avatarUrl = uploadResult.secure_url;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
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

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ msg: "Error al registrar el usuario" });
    }
};

