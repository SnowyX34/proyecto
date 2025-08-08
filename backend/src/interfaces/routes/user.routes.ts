import { Router } from 'express';
import { loginUser } from '../controllers/login.controller';
import { registerUser } from '../controllers/register.controller';
import { validateLogin, validateUserInput } from '../middlewares/validateUser';
import { handleMulterError, upload } from '../middlewares/user.middelware';

const router = Router();

router.post('/login', validateLogin, loginUser);
router.post('/register', 
    upload.single('avatar'), 
    handleMulterError,
    validateUserInput, 
    registerUser
);

export default router;