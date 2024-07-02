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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const product_1 = __importDefault(require("../routes/product"));
const user_1 = __importDefault(require("../routes/user"));
const product_2 = require("./product");
const user_2 = require("./user");
const validate_token_1 = __importDefault(require("../routes/validate-token")); // Importar el middleware validateToken
const user_3 = __importDefault(require("../routes/user"));
const user_4 = require("../controllers/user");
const user_5 = require("../controllers/user");
const config_1 = require("./config");
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '3001';
        this.listen();
        this.middlewares();
        this.routes();
        this.dbConnect();
    }
    listen() {
        this.app.listen(config_1.PORT, () => {
            console.log('Aplicacion corriendo en el puerto ' + this.port);
        });
    }
    routes() {
        // Rutas públicas
        this.app.use('/api/users', user_1.default);
        // Rutas protegidas
        this.app.use('/api/products', validate_token_1.default, product_1.default); // Agregar validateToken como middleware para las rutas protegidas
        this.app.use('/api/users/forgot-password', user_3.default);
        this.app.use('/api/reset-password', user_5.resetPassword);
        // Ruta para verificar el código de verificación
        this.app.use('/api/verify-code', user_4.verifyVerificationCode); // Utiliza la función verifyVerificationCode del controlador de usuario
    }
    middlewares() {
        // Parseo body
        this.app.use(express_1.default.json());
        // Cors
        this.app.use((0, cors_1.default)());
    }
    dbConnect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield product_2.Product.sync();
                yield user_2.User.sync();
            }
            catch (error) {
                console.error('Unable to connect to the database:', error);
            }
        });
    }
}
exports.default = Server;
