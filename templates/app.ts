import 'express-async-errors';
import 'dotenv/config';
import './modules/logger';
import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import routes from './routes';

const ENV_IS_PROD = String(process.env.NODE_ENV).includes('prod');

const app = express();
app.use(morgan('dev'));
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use((req: Request, res: Response, next: NextFunction)=>{
    res.set('Access-Control-Allow-Origin', ENV_IS_PROD ? 'https://site.com/' : '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    res.set('Access-Control-Allow-Headers', ['authorization', 'apikey']);
    res.setHeader(
        "Content-Security-Policy",
        `default-src *; img-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *; style-src  'self' 'unsafe-inline' *`
    );
    next();
});

app.get('/healthcheck', (req: Request, res: Response) => {
    return res.status(200).send(
        `API ${ENV_IS_PROD ? 'Produção' : 'Desenvolvimento'}`
    );
});

app.use(routes);

app.use((error: any, req: Request, res: Response, next: NextFunction)=>{
    console.error(`[ERROR]: ${req.method.toUpperCase()} ${req.path} => `, error);

    let status = error?.status || 500;
    let { message } = error;
    delete error.status;    

    return res.status(status).send({
        error: true,
        message
    });
});

app.use((req: Request, res: Response) => {
    return res.status(404).send();
});

export default app;