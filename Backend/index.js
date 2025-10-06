import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import requestToAI from './src/aiModel/aiModelRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

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