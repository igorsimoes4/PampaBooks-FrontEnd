const multer = require('multer');
const path = require('path');

// Configurações do Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads'); // Pasta de destino
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`); // Nome do arquivo
    }
});

// Filtro de arquivos (aceita apenas imagens)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb('Erro: Apenas imagens são permitidas!');
    }
};

// Middleware Multer
const upload = multer({ 
    storage: storage, 
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Limite de 5MB
});

module.exports = upload;
