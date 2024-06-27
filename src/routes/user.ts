import { Router } from 'express';
import { resetPassword, forgotPassword, loginUser, newUser, getUserRole } from '../controllers/user';
import { handleError500 } from '../controllers/errorController'; 
import { verifyVerificationCode } from '../controllers/user';

const router = Router();

router.post('/', newUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);

router.use(handleError500);
router.post('/reset-password', resetPassword);
// Agrega la ruta para verificar el código de verificación
router.post('/verify-code', verifyVerificationCode);
// Ruta para obtener el rol del usuario
router.get('/user-role', getUserRole);

export default router;