import express, { Application } from 'express';
import cors from 'cors';
import routesUser from '../../../interfaces/routes/user.routes';
import routesCotizaciones from '../../../interfaces/routes/cotizaciones.routes'
import routesProduct from '../../../interfaces/routes/product.routes'
import { User } from '../models/user.model'; // Importación con nombre
import { Product } from '../models/product.model';
import Quotation from '../models/quotation.model';
import QuotationItem from '../models/quotation-item.model';
import path from 'path';

class Server {
    private readonly app: Application;
    private readonly port: string;

    constructor() {
        this.app = express();
        this.port = process.env.PORT ?? '3000';

        this.middlewares();
        this.routes();
        this.setupAssociations(); // Llama a setupAssociations ANTES de dbConnect
        this.dbConnect();
        this.listen();
    }

    private listen() {
        this.app.listen(this.port, () => {
            console.log(`Aplicación corriendo en el puerto ${this.port}`);
        });
    }

    private routes() {
        this.app.use('/api/users', routesUser);
        this.app.use('/api/products', routesProduct);
        this.app.use('/api/cotizaciones', routesCotizaciones);
        const uploadsPath = path.join(process.cwd(), 'uploads');
        this.app.use('/uploads', express.static(path.join(__dirname, '../../../../uploads')));
        this.app.get('/test', (req, res) => {
            res.json({
                uploadsPath: uploadsPath,
                currentDir: process.cwd()
            });
        });
    }

    private middlewares() {
        this.app.use(express.json());
        this.app.use(cors({
            origin: 'https://frontend-4sj7.onrender.com',
            credentials: true
        }));
    }

    private async dbConnect() {
        try {
            // El orden de sync() no debería afectar las asociaciones si ya se definieron
            await User.sync();
            await Product.sync();
            await Quotation.sync();
            await QuotationItem.sync();

            console.log('Base de datos conectada y sincronizada');
        } catch (error) {
            console.error('Error al conectar la base de datos:', error);
        }
    }

    private setupAssociations() {
        console.log('Setting up Sequelize associations...');
        console.log('User model:', User ? 'Loaded' : 'Not Loaded');
        console.log('Quotation model:', Quotation ? 'Loaded' : 'Not Loaded');
        console.log('QuotationItem model:', QuotationItem ? 'Loaded' : 'Not Loaded');
        console.log('Product model:', Product ? 'Loaded' : 'Not Loaded');

        // Asegúrate de que todos los modelos estén importados y disponibles aquí
        if (User && Quotation) {
            User.associate({ Quotation });
            console.log('User.associate called.');
        } else {
            console.error('User or Quotation model not loaded for User.associate.');
        }

        if (Quotation && User && QuotationItem) {
            Quotation.associate({ User, QuotationItem });
            console.log('Quotation.associate called.');
        } else {
            console.error('Quotation, User, or QuotationItem model not loaded for Quotation.associate.');
        }

        if (QuotationItem && Quotation && Product) {
            QuotationItem.associate({ Quotation, Product });
            console.log('QuotationItem.associate called.');
        } else {
            console.error('QuotationItem, Quotation, or Product model not loaded for QuotationItem.associate.');
        }

        // Product.associate está definido en product.model.ts pero no usa modelos específicos en su firma actual.
        if (Product) {
            Product.associate({}); // Llama con un objeto vacío si no necesita modelos específicos
            console.log('Product.associate called.');
        } else {
            console.error('Product model not loaded for Product.associate.');
        }

        console.log('Sequelize asociaciones configuradas.');
    }
}

export default Server;
