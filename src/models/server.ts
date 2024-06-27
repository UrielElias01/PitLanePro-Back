import express, { Application } from 'express';
import cors from 'cors';
import routesProduct from '../routes/product';
import routesUser from '../routes/user';
import { Product } from './product';
import { User } from './user';
import validateToken from '../routes/validate-token'; // Importar el middleware validateToken
import forgotPasswordRoute from '../routes/user'; 
import { verifyVerificationCode } from '../controllers/user';
import { resetPassword } from '../controllers/user';
import { PORT } from './config';

class Server {
    private app: Application;
    private port: string;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '3001';
        this.listen();
        this.middlewares();
        this.routes();
        this.dbConnect();
    }

    listen() {
        this.app.listen(PORT, () => {
            console.log('Aplicacion corriendo en el puerto ' + this.port);
        });
    }

    routes() {
        // Rutas públicas
        this.app.use('/api/users', routesUser);

        // Rutas protegidas
        this.app.use('/api/products', validateToken, routesProduct); // Agregar validateToken como middleware para las rutas protegidas

        this.app.use('/api/users/forgot-password', forgotPasswordRoute);

        this.app.use('/api/reset-password', resetPassword)

        
    // Ruta para verificar el código de verificación
    this.app.use('/api/verify-code', verifyVerificationCode); // Utiliza la función verifyVerificationCode del controlador de usuario

    
    }

    middlewares() {
        // Parseo body
        this.app.use(express.json());

        // Cors
        this.app.use(cors());
    }

    async dbConnect() {
        try {
            await Product.sync();
            await User.sync();
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }
}

export default Server;
