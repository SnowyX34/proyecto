import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Asegurar que el directorio uploads existe
const uploadDir = path.join(__dirname, '../../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Generar nombre único para el archivo
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, `avatar-${uniqueSuffix}${extension}`);
    }
});

const fileFilter = (req: any, file: any, cb: any) => {
    // Validar tipos de archivo permitidos
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no permitido. Solo se permiten imágenes JPG, PNG, GIF y WebP.'), false);
    }
};

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 1
    },
    fileFilter: fileFilter
});

// Middleware para manejar errores de multer
export const handleMulterError = (error: any, req: any, res: any, next: any) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                msg: 'El archivo es demasiado grande. El tamaño máximo es 5MB.'
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                msg: 'Solo se permite un archivo por vez.'
            });
        }
    }
    
    if (error.message.includes('Tipo de archivo no permitido')) {
        return res.status(400).json({
            msg: error.message
        });
    }
    
    next(error);
};