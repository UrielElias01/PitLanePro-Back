import { Sequelize } from "sequelize";
import { DB_NAME, DB_PASSWORD, DB_HOST, DB_USER, DB_PORT } from "../models/config";

// Convertir DB_PORT a número si es una cadena válida
const port: number | undefined = typeof DB_PORT === 'string' ? parseInt(DB_PORT) : undefined;

const sequelize = new Sequelize('pitlane', 'root', '123456', {
    host: 'localhost',
    dialect: 'mysql',
    
});

export default sequelize;
