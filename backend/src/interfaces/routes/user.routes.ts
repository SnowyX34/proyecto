import { Router } from 'express';
import { loginUser } from '../controllers/login.controller';
<<<<<<< HEAD
import { createUser } from '../controllers/register.controller';
import { validateLogin, validateUserInput } from '../middlewares/validateUser';
import { upload } from '../middlewares/upload.middleware';
=======
import { registerUser } from '../controllers/register.controller';
import { validateLogin, validateUserInput } from '../middlewares/validateUser';
import { handleMulterError, upload } from '../middlewares/user.middelware';
>>>>>>> 5837d271ff19383e3e30f3ee65bcc6dcf81a5592

const router = Router();

router.post('/login', validateLogin, loginUser);
<<<<<<< HEAD
router.post('/register', upload.single('avatar'), createUser,validateUserInput);

=======
router.post('/register', 
    upload.single('avatar'), 
    handleMulterError,
    validateUserInput, 
    registerUser
);
>>>>>>> 5837d271ff19383e3e30f3ee65bcc6dcf81a5592

export default router;