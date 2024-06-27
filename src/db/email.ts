import * as nodemailer from 'nodemailer';
import crypto from 'crypto';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';

// Base de datos temporal para almacenar códigos generados
const codeStore = new Map<string, string>(); // Map<correo, codigo>

// Configura el transporte de nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'urielelias.01@gmail.com',
        pass: 'kxgocizkawkkflkt'
    }
});


const generateToken = (username: string, role: string): string => {
    const expiresIn = '3600s'; // Tiempo de expiración en horas
    const code = jwt.sign({ username, role }, process.env.SECRET_KEY || 'pepito123', { expiresIn });
    return code;
};
// Función para generar un código aleatorio
function generateRandomCode(): string {
    return crypto.randomBytes(6).toString('hex'); // Genera un código de 6 caracteres hexadecimales
}

// Función para enviar un correo electrónico con el código generado y almacenarlo en la base de datos
export async function sendVerificationCodeAndStoreInDB(username: string, rol: string): Promise<void> {
    try {
         const user: any = await User.findOne({ where: { username } });
         const code = generateToken(user.username, user.role);
        //const code = generateRandomCode();
        await User.update({ verificationCode: code }, { where: { username } }); //Actualiza el campo verificationCode en la base de datos
        const mailOptions = {
            from: 'urielelias.01@gmail.com',
            to: username,
            subject: 'Código de verificación',
            text: `Tu código de verificación es: ${code}`
        };
        await transporter.sendMail(mailOptions);
        console.log('Correo electrónico enviado exitosamente.');
    } catch (error) {
        console.error('Error al enviar el correo electrónico de verificación y almacenarlo en la base de datos:', error);
        throw new Error('Error al enviar el correo electrónico de verificación y almacenarlo en la base de datos');
    }
}
// Función para verificar el código ingresado por el usuario
export function verifyCode(username: string, code: string): boolean {
    const storedCode = codeStore.get(username);
    if (storedCode === code) {
        // Elimina el código almacenado después de ser utilizado
        codeStore.delete(username);
        return true;
    }
    return false;
}
