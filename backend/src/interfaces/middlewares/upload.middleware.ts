<<<<<<< HEAD
// src/middlewares/upload.middleware.ts
import multer from 'multer';

// Configuración para usar memoria en lugar de disco
const storage = multer.memoryStorage();
=======
// src/middlewares/upload.ts
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// ✅ Crear la carpeta uploads si no existe
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Carpeta uploads creada:', uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Guardando archivo en:', uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    console.log('Nombre de archivo generado:', uniqueName);
    cb(null, uniqueName);
  }
});
>>>>>>> 5837d271ff19383e3e30f3ee65bcc6dcf81a5592

export const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    // Solo permitir imágenes
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
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