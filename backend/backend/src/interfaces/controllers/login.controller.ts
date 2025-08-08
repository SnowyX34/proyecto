import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User from '../../infrestructure/orm/models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const loginUser = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({msg: "Datos inválidos", errors: errors.array()});
        return;
    }
        
    const { email, password } = req.body;
    
    const user: any = await User.findOne({ where: { email: email } });
    
    if (!user) {
        res.status(400).json({
            msg: `Ha ocurrido un problema, vuelve a intentar`
        });
        return;
    }
    
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
        res.status(400).json({
            msg: "La contraseña o correo ingresada es incorrecta"
        });
        return;
    }
    
    const token = jwt.sign(
        {
            user_id: user.user_id,           // ✅ Usar user_id en lugar de email
            email: user.email,
            role: user.role,
            username: user.user_name,        // ✅ Cambiar a user_name
            user_secondName: user.user_secondName, // ✅ Agregar apellido
            avatarUrl: user.avatarUrl        // ✅ Esto ya está correcto
        },
        process.env.SECRET_KEY ?? 'ulisesfloresmtz',
        {
            expiresIn: '1h'
        }
    );
    
    res.json({ token });
};