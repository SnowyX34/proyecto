"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
<<<<<<< HEAD
// src/middlewares/upload.middleware.ts
const multer_1 = __importDefault(require("multer"));
// Configuración para usar memoria en lugar de disco
const storage = multer_1.default.memoryStorage();
=======
// src/middlewares/upload.ts
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// ✅ Crear la carpeta uploads si no existe
const uploadDir = path_1.default.join(process.cwd(), 'uploads');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
    console.log('Carpeta uploads creada:', uploadDir);
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        console.log('Guardando archivo en:', uploadDir);
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path_1.default.extname(file.originalname);
        console.log('Nombre de archivo generado:', uniqueName);
        cb(null, uniqueName);
    }
});
>>>>>>> 5837d271ff19383e3e30f3ee65bcc6dcf81a5592
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter: (req, file, cb) => {
        // Solo permitir imágenes
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Solo se permiten archivos de imagen'));
        }
    },
    limits: {
<<<<<<< HEAD
        fileSize: 10 * 1024 * 1024 // 10MB
=======
        fileSize: 5 * 1024 * 1024 // 5MB
>>>>>>> 5837d271ff19383e3e30f3ee65bcc6dcf81a5592
    }
});
