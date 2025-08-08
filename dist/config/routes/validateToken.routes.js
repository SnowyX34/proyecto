"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateToken = (req, res, next) => {
    const headerToken = req.headers['authorization'];
    if (headerToken && headerToken.startsWith('Bearer ')) {
        try {
            const bearerToken = headerToken.slice(7);
            const decoded = jsonwebtoken_1.default.verify(bearerToken, process.env.SECRET_KEY || 'ulisesfloresmtz');
            // Adjuntar el token decodificado a la solicitud para su uso posterior
            req.user = decoded;
            next();
        }
        catch (error) {
            console.error('Error al verificar el token:', error.message);
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                return res.status(401).json({ msg: 'Token expirado' });
            }
            else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                return res.status(401).json({ msg: 'Token inválido' });
            }
            return res.status(500).json({
                msg: 'Error al verificar el token',
                error: error.message
            });
        }
    }
    else {
        return res.status(401).json({
            msg: 'Acceso denegado: no se proporcionó un token'
        });
    }
};
exports.default = validateToken;
