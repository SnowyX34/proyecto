import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User from '../../infrestructure/orm/models/user.model';
import bcrypt from 'bcryptjs';

export const registerUser = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    const { user_name, password, user_secondName, email, phone_number, role } = req.body;

    // Manejar la URL del avatar
    let avatarUrl = '/uploads/default-user.png'; // valor por defecto
    
    if (req.file) {
        avatarUrl = `/uploads/${req.file.filename}`;
    }

    // Validar campos obligatorios
    if (!user_name || !user_secondName || !email || !password || !phone_number) {
        res.status(400).json({ msg: "Todos los campos son obligatorios" });
        return;
    }

    try {
        // Validamos si el usuario existe en la base de datos
        const existingUser = await User.findOne({ where: { email: email } });
        
        if (existingUser) {
            res.status(400).json({
                msg: 'El correo electrónico ya está registrado'
            });
            return;
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el usuario
        const newUser = await User.create({
            user_name: user_name,
            password: hashedPassword,
            user_secondName,
            email,
            phone_number,
            role,
            avatarUrl
        });

        res.status(201).json({
            msg: `Usuario ${user_name} creado exitosamente`,
            user: {
                id: newUser.get('id'),
                user_name: newUser.get('user_name'),
                user_secondName: newUser.get('user_secondName'),
                email: newUser.get('email'),
                phone_number: newUser.get('phone_number'),
                role: newUser.get('role'),
                avatarUrl: newUser.get('avatarUrl')
            }
        });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({
            msg: 'Error interno del servidor',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};