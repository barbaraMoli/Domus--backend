import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import requestToAI from './src/aiModel/aiModelRoute.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use('/requestToAI', requestToAI);

try {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    })
} catch (err) {
    console.error('Error al conectar el servidor');
    process.exit(1);
}