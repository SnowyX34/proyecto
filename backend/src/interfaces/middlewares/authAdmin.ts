import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: number;
  role: string;
}

interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const verifyAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: 'Ha ocurrido un error' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY || 'ulisesfloresmtz') as JwtPayload;

    if (decoded.role !== 'admin') {
      res.status(403).json({ message: 'Acceso denegado.'});
      return;
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Ocurrio un error' });
    return;
  }
};
