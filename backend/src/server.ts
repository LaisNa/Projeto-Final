import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes';

dotenv.config();

const port: any = process.env.API_PORT;
const app = express();
app.use(express.json());
app.use(cors({
    origin: '*'
}));
app.use(router);

app.listen(port, () => console.log("Servidor de teste iniciado na porta: " + port));