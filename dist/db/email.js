"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.verifyCode = exports.sendVerificationCodeAndStoreInDB = void 0;
const nodemailer = __importStar(require("nodemailer"));
const crypto_1 = __importDefault(require("crypto"));
const user_1 = require("../models/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Base de datos temporal para almacenar códigos generados
const codeStore = new Map(); // Map<correo, codigo>
// Configura el transporte de nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'urielelias.01@gmail.com',
        pass: 'kxgocizkawkkflkt'
    }
});
const generateToken = (username, role) => {
    const expiresIn = '3600s'; // Tiempo de expiración en horas
    const code = jsonwebtoken_1.default.sign({ username, role }, process.env.SECRET_KEY || 'pepito123', { expiresIn });
    return code;
};
// Función para generar un código aleatorio
function generateRandomCode() {
    return crypto_1.default.randomBytes(6).toString('hex'); // Genera un código de 6 caracteres hexadecimales
}
// Función para enviar un correo electrónico con el código generado y almacenarlo en la base de datos
function sendVerificationCodeAndStoreInDB(username, rol) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_1.User.findOne({ where: { username } });
            const code = generateToken(user.username, user.role);
            //const code = generateRandomCode();
            yield user_1.User.update({ verificationCode: code }, { where: { username } }); //Actualiza el campo verificationCode en la base de datos
            const mailOptions = {
                from: 'urielelias.01@gmail.com',
                to: username,
                subject: 'Código de verificación',
                text: `Tu código de verificación es: ${code}`
            };
            yield transporter.sendMail(mailOptions);
            console.log('Correo electrónico enviado exitosamente.');
        }
        catch (error) {
            console.error('Error al enviar el correo electrónico de verificación y almacenarlo en la base de datos:', error);
            throw new Error('Error al enviar el correo electrónico de verificación y almacenarlo en la base de datos');
        }
    });
}
exports.sendVerificationCodeAndStoreInDB = sendVerificationCodeAndStoreInDB;
// Función para verificar el código ingresado por el usuario
function verifyCode(username, code) {
    const storedCode = codeStore.get(username);
    if (storedCode === code) {
        // Elimina el código almacenado después de ser utilizado
        codeStore.delete(username);
        return true;
    }
    return false;
}
exports.verifyCode = verifyCode;
