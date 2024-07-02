"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserRole = exports.resetPassword = exports.forgotPassword = exports.verifyVerificationCode = exports.loginUser = exports.newUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("../models/user");
const email_1 = require("../db/email");
// Función para generar un código de recuperación (ejemplo)
const newUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, role } = req.body;
    try {
        // Validamos si el usuario ya existe en la base de datos
        const existingUser = yield user_1.User.findOne({ where: { username: username } });
        if (existingUser) {
            return res.status(400).json({
                msg: `Usuario existente con el nombre ${username}`,
            });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Guardamos usuario en la base de datos
        yield user_1.User.create({
            username,
            password: hashedPassword,
            role // Asignamos el rol proporcionado en el cuerpo de la solicitud
        });
        res.json({
            msg: `Usuario ${username} creado exitosamente!`
        });
    }
    catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
        });
    }
});
exports.newUser = newUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield user_1.User.findOne({ where: { username } });
        if (!user) {
            return res.status(400).json({
                error: 'Usuario no encontrado',
            });
        }
        // Validamos password
        const passwordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordValid) {
            return res.status(400).json({
                error: 'Contraseña incorrecta',
            });
        }
        // Si el usuario existe, envía un correo electrónico con el código de verificación y lo almacena en la base de datos
        const token = yield (0, email_1.sendVerificationCodeAndStoreInDB)(user.username, user.rol);
        // Envía una respuesta al cliente con la URL de redirección
        res.json(token);
    }
    catch (error) {
        console.error('Error al autenticar usuario:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
        });
    }
});
exports.loginUser = loginUser;
const verifyVerificationCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { enteredCode } = req.body; // Accede al campo enteredCode del objeto req.body
    try {
        console.log('Código de verificación recibido:', enteredCode);
        const user = yield user_1.User.findOne({ where: { verificationCode: enteredCode } });
        console.log('Usuario encontrado en la base de datos:', user);
        if (!user) {
            console.log('No se encontró ningún usuario con el código de verificación proporcionado');
            return res.status(400).json({ error: 'Código de verificación incorrecto' });
        }
        console.log('Usuario encontrado:', user);
        yield user.update({ isVerified: true, verificationCode: enteredCode });
        console.log('Usuario marcado como verificado:', user);
        res.status(200).json({ message: 'Código de verificación válido' });
    }
    catch (error) {
        console.error('Error al verificar el código de verificación:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
exports.verifyVerificationCode = verifyVerificationCode;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, rol } = req.body;
    // Verificar si el campo 'username' está presente y no es undefined
    if (!username) {
        return res.status(400).json({
            error: 'El campo "username" es requerido',
        });
    }
    try {
        // Validamos si el usuario existe en la base de datos
        const user = yield user_1.User.findOne({ where: { username } });
        if (!user) {
            return res.status(400).json({
                error: 'Usuario no encontrado',
            });
        }
        // Envía un correo electrónico al usuario con el código de recuperación
        try {
            yield (0, email_1.sendVerificationCodeAndStoreInDB)(username, rol); // Envía el correo electrónico con el código de verificación
            // Envía una respuesta JSON indicando que el correo se ha enviado correctamente
            res.status(200).json({
                message: 'Correo electrónico enviado con éxito'
            });
        }
        catch (error) {
            console.error('Error al enviar el correo electrónico:', error);
            // Envía una respuesta JSON indicando que ha ocurrido un error al enviar el correo
            res.status(500).json({
                error: 'Ocurrió un error al enviar el correo electrónico',
            });
        }
    }
    catch (error) {
        console.error('Error al buscar usuario:', error);
        // Envía una respuesta JSON indicando que ha ocurrido un error interno del servidor
        res.status(500).json({
            error: 'Error interno del servidor',
        });
    }
});
exports.forgotPassword = forgotPassword;
// Ruta para manejar la actualización de contraseña con el código de recuperación
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { recoveryCode, newPassword } = req.body;
    try {
        // Verifica si el código de recuperación es válido y obtén el usuario correspondiente
        const user = yield user_1.User.findOne({ where: { verificationCode: recoveryCode } });
        // Verifica si se encontró un usuario con el código de recuperación proporcionado
        if (!user) {
            return res.status(400).json({ error: 'Código de recuperación inválido' });
        }
        // Genera el hash de la nueva contraseña
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
        // Actualiza la contraseña del usuario en la base de datos y elimina el código de recuperación
        yield user.update({ password: hashedPassword, verificationCode: recoveryCode });
        res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
    }
    catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
exports.resetPassword = resetPassword;
// Controlador para obtener el rol del usuario
const getUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, role } = req.body;
    const user = yield user_1.User.findOne({ where: { username } });
    try {
        // Aquí obtienes la información del usuario desde donde sea que la almacenes en tu base de datos
        // En este ejemplo, supongamos que obtienes la información del usuario del objeto req.user
        // Asegúrate de ajustar esto según tu implementación específica
        // Por ejemplo, si tienes la información del usuario en req.user, puedes obtener el rol así:
        const role = user.role;
        // Imprime el rol en la consola del servidor
        console.log('Rol del usuario:', role);
        // Devuelve el rol del usuario en la respuesta JSON
        res.json({
            role,
        });
    }
    catch (error) {
        console.error('Error al obtener el rol del usuario:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
        });
    }
});
exports.getUserRole = getUserRole;
