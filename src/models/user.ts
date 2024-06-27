import { DataTypes } from 'sequelize';
import sequelize from '../db/connection';

export const User = sequelize.define('user', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('admin', 'usuario', 'editor'),
        allowNull: false,
        defaultValue: 'usuario'
    },
    verificationCode: {
        type: DataTypes.STRING
    },
    isVerified: { 
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

