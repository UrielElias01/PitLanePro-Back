import https from 'https';
import fs from 'fs';
import express, { Application } from 'express';
import cors from 'cors';
import routesProduct from '../routes/product';
import routesUser from '../routes/user';
import validateToken from '../routes/validate-token';
import forgotPasswordRoute from '../routes/user'; 
import { getUserRole, verifyVerificationCode, resetPassword } from '../controllers/user';

import { PORT } from './config';
import { Product } from './product';
import { User } from './user';

class Server {
    private app: Application;
    private port: string;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '3001';
        this.middlewares();
        this.routes();
        this.dbConnect();
        this.listen();
    }

    listen() {
        const httpsOptions = {
            key: fs.readFileSync('/etc/nginx/ssl/nginx-plp.crt;'),
            cert: fs.readFileSync('/etc/nginx/ssl/nginx-plp.key;')
        };

        https.createServer(httpsOptions, this.app).listen(PORT, () => {
            console.log('Aplicacion corriendo en el puerto ' + this.port);
        });
    }

    routes() {
        this.app.use('/api/users', routesUser);
        this.app.use('/api/products', validateToken, routesProduct);
        this.app.use('/api/users/forgot-password', forgotPasswordRoute);
        this.app.use('/api/reset-password', resetPassword);
        this.app.use('/api/user-role', getUserRole);
        this.app.use('/api/verify-code', verifyVerificationCode);
    }

    middlewares() {
        this.app.use(express.json());
        this.app.use(cors({
            origin: '*',
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            allowedHeaders: 'Content-Type, Authorization'
        }));
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
