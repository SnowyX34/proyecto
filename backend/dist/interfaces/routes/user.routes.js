"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const login_controller_1 = require("../controllers/login.controller");
const register_controller_1 = require("../controllers/register.controller");
const validateUser_1 = require("../middlewares/validateUser");
<<<<<<< HEAD
const upload_middleware_1 = require("../middlewares/upload.middleware");
const router = (0, express_1.Router)();
router.post('/login', validateUser_1.validateLogin, login_controller_1.loginUser);
router.post('/register', upload_middleware_1.upload.single('avatar'), register_controller_1.createUser, validateUser_1.validateUserInput);
=======
const user_middelware_1 = require("../middlewares/user.middelware");
const router = (0, express_1.Router)();
router.post('/login', validateUser_1.validateLogin, login_controller_1.loginUser);
router.post('/register', user_middelware_1.upload.single('avatar'), user_middelware_1.handleMulterError, validateUser_1.validateUserInput, register_controller_1.registerUser);
>>>>>>> 5837d271ff19383e3e30f3ee65bcc6dcf81a5592
exports.default = router;
