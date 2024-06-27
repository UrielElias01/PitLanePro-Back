import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const validateToken = (req: Request, res: Response, next: NextFunction) => {
    const headerToken = req.headers['authorization'];

    if (headerToken && headerToken.startsWith('Bearer ')) {
        try {
            const bearerToken = headerToken.slice(7);
            const decodedToken: any = jwt.verify(bearerToken, process.env.SECRET_KEY || 'pepito123');

            // Verificar si el token decodificado tiene un rol permitido
            const allowedRoles = ['admin', 'editor'];
            if (decodedToken && allowedRoles.includes(decodedToken.role)) {
                // Usuario con rol permitido
                next();
            } else {
                res.status(403).json({ msg: 'Acceso denegado: Rol no autorizado' });
            }
        } catch (error) {
            res.status(401).json({ msg: 'Token inválido o expirado' });
        }
    } else {
        res.status(401).json({ msg: 'Acceso denegado: Token no proporcionado' });
    }
};

export default validateToken;
