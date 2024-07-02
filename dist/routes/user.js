"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const errorController_1 = require("../controllers/errorController");
const user_2 = require("../controllers/user");
const router = (0, express_1.Router)();
router.post('/', user_1.newUser);
router.post('/login', user_1.loginUser);
router.post('/forgot-password', user_1.forgotPassword);
router.use(errorController_1.handleError500);
router.post('/reset-password', user_1.resetPassword);
// Agrega la ruta para verificar el código de verificación
router.post('/verify-code', user_2.verifyVerificationCode);
// Ruta para obtener el rol del usuario
router.get('/user-role', user_1.getUserRole);
exports.default = router;
