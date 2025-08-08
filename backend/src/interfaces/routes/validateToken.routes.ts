import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const validateToken = (req: Request, res: Response, next: NextFunction) => {
    const headerToken = req.headers['authorization'];

    if (headerToken && headerToken.startsWith('Bearer ')) {
        try {
            const bearerToken = headerToken.slice(7); 
            const decoded = jwt.verify(bearerToken, process.env.SECRET_KEY || 'ulisesfloresmtz');

            // Adjuntar el token decodificado a la solicitud para su uso posterior
            (req as any).user = decoded;

            next();
        } catch (error: any) {
            console.error('Error al verificar el token:', error.message);
            if (error instanceof jwt.TokenExpiredError) {
                return res.status(401).json({ msg: 'Token expirado' });
            } else if (error instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({ msg: 'Token inválido' });
            }
            return res.status(500).json({
                msg: 'Error al verificar el token',
                error: error.message
            });
        }
    } else {
        return res.status(401).json({
            msg: 'Acceso denegado: no se proporcionó un token'
        });
    }
}

export default validateToken;
