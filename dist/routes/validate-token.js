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
            const decodedToken = jsonwebtoken_1.default.verify(bearerToken, process.env.SECRET_KEY || 'pepito123');
            // Verificar si el token decodificado tiene un rol permitido
            const allowedRoles = ['admin', 'editor'];
            if (decodedToken && allowedRoles.includes(decodedToken.role)) {
                // Usuario con rol permitido
                next();
            }
            else {
                res.status(403).json({ msg: 'Acceso denegado: Rol no autorizado' });
            }
        }
        catch (error) {
            res.status(401).json({ msg: 'Token inválido o expirado' });
        }
    }
    else {
        res.status(401).json({ msg: 'Acceso denegado: Token no proporcionado' });
    }
};
exports.default = validateToken;
