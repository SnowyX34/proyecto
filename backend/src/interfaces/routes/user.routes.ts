import { Router } from 'express';
import { loginUser } from '../controllers/login.controller';
import { createUser } from '../controllers/register.controller';
import { validateLogin, validateUserInput } from '../middlewares/validateUser';
import { upload } from '../middlewares/upload.middleware';
const router = Router();

router.post('/login', validateLogin, loginUser);
router.post('/register', upload.single('avatar'), createUser,validateUserInput);


export default router;