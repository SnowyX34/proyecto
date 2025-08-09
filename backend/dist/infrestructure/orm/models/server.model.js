"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_routes_1 = __importDefault(require("../../../interfaces/routes/user.routes"));
const cotizaciones_routes_1 = __importDefault(require("../../../interfaces/routes/cotizaciones.routes"));
const product_routes_1 = __importDefault(require("../../../interfaces/routes/product.routes"));
const user_model_1 = require("../models/user.model"); // Importación con nombre
const product_model_1 = require("../models/product.model");
const quotation_model_1 = __importDefault(require("../models/quotation.model"));
const quotation_item_model_1 = __importDefault(require("../models/quotation-item.model"));
const path_1 = __importDefault(require("path"));
class Server {
    constructor() {
        var _a;
        this.app = (0, express_1.default)();
        this.port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : '3000';
        this.middlewares();
        this.routes();
        this.setupAssociations(); // Llama a setupAssociations ANTES de dbConnect
        this.dbConnect();
        this.listen();
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Aplicación corriendo en el puerto ${this.port}`);
        });
    }
    routes() {
        this.app.use('/api/users', user_routes_1.default);
        this.app.use('/api/products', product_routes_1.default);
        this.app.use('/api/cotizaciones', cotizaciones_routes_1.default);
        const uploadsPath = path_1.default.join(process.cwd(), 'uploads');
        this.app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../../../../uploads')));
        this.app.get('/test', (req, res) => {
            res.json({
                uploadsPath: uploadsPath,
                currentDir: process.cwd()
            });
        });
    }
    middlewares() {
        this.app.use(express_1.default.json());
        this.app.use((0, cors_1.default)({
            origin: 'https://proyecto-1-yx7j.onrender.com',
            credentials: true
        }));
    }
    async dbConnect() {
        try {
            // El orden de sync() no debería afectar las asociaciones si ya se definieron
            await user_model_1.User.sync();
            await product_model_1.Product.sync();
            await quotation_model_1.default.sync();
            await quotation_item_model_1.default.sync();
            console.log('Base de datos conectada y sincronizada');
        }
        catch (error) {
            console.error('Error al conectar la base de datos:', error);
        }
    }
    setupAssociations() {
        console.log('Setting up Sequelize associations...');
        console.log('User model:', user_model_1.User ? 'Loaded' : 'Not Loaded');
        console.log('Quotation model:', quotation_model_1.default ? 'Loaded' : 'Not Loaded');
        console.log('QuotationItem model:', quotation_item_model_1.default ? 'Loaded' : 'Not Loaded');
        console.log('Product model:', product_model_1.Product ? 'Loaded' : 'Not Loaded');
        // Asegúrate de que todos los modelos estén importados y disponibles aquí
        if (user_model_1.User && quotation_model_1.default) {
            user_model_1.User.associate({ Quotation: quotation_model_1.default });
            console.log('User.associate called.');
        }
        else {
            console.error('User or Quotation model not loaded for User.associate.');
        }
        if (quotation_model_1.default && user_model_1.User && quotation_item_model_1.default) {
            quotation_model_1.default.associate({ User: user_model_1.User, QuotationItem: quotation_item_model_1.default });
            console.log('Quotation.associate called.');
        }
        else {
            console.error('Quotation, User, or QuotationItem model not loaded for Quotation.associate.');
        }
        if (quotation_item_model_1.default && quotation_model_1.default && product_model_1.Product) {
            quotation_item_model_1.default.associate({ Quotation: quotation_model_1.default, Product: product_model_1.Product });
            console.log('QuotationItem.associate called.');
        }
        else {
            console.error('QuotationItem, Quotation, or Product model not loaded for QuotationItem.associate.');
        }
        // Product.associate está definido en product.model.ts pero no usa modelos específicos en su firma actual.
        if (product_model_1.Product) {
            product_model_1.Product.associate({}); // Llama con un objeto vacío si no necesita modelos específicos
            console.log('Product.associate called.');
        }
        else {
            console.error('Product model not loaded for Product.associate.');
        }
        console.log('Sequelize asociaciones configuradas.');
    }
}
exports.default = Server;
