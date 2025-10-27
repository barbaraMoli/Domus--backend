import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';

import { verificarConexion } from './src/database.js';
import { initializeDatabase, verificarTablas } from './src/initDatabase.js';

// Rutas
import authRoutes from './src/auth/user.js';
import sensorRoutes from './src/sensor/sensorRoutes.js';
import robotRoutes from './src/robot/controller.js';
import alertasRoutes from './src/alertas/alertasRoutes.js';
import iaRoutes from './src/ia/iaRoutes.js';
// import sosRoutes from './src/sos/sosRoutes.js';

import requestToAI from './src/aiModel/aiModelRoute.js';
import { startMCP } from './src/mcp/mcp.js';
import { start } from 'repl';
// import { loggerMiddleware } from './src/utils/logger.js';

const app = express();
const PORT = process.env.PORT || 3000;

// ==================
// MIDDLEWARES (antes del listen)
// ==================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Permitir lista de orígenes desde env (coma-separado) o '*'
const allowedOrigins =
    process.env.CORS_ORIGIN?.split(',').map(s => s.trim()) || '*';

app.use(
    cors({
        origin: allowedOrigins,
    })
);

// app.use(loggerMiddleware);

// Rutas públicas
app.get('/health', (_req, res) => {
    res.json({
        status: 'OK',
        message: 'Servidor funcionando correctamente',
        timestamp: new Date(),
        version: '1.0.0',
    });
});

app.get('/api/docs', (_req, res) => {
    res.json({
        version: '1.0.0',
        proyecto: 'Domus - Robot Autónomo con Sensores',
        endpoints: {
            autenticacion: {
                registro: 'POST /api/auth/registro',
                login: 'POST /api/auth/login',
                perfil: 'GET /api/auth/perfil',
                usuarios: 'GET /api/auth/usuarios (admin)',
            },
            sensores: {
                obtener: 'GET /api/sensors',
                crear: 'POST /api/sensors',
                batch: 'POST /api/sensors/batch',
                estadisticas: 'GET /api/sensors/stats/:dispositivo_id',
                publicas: 'GET /api/sensors/estadisticas-publicas',
            },
            robot: {
                mover: 'POST /api/robot/mover',
                rotar: 'POST /api/robot/rotar',
                buscar: 'POST /api/robot/buscar',
                parar: 'POST /api/robot/parar',
                posicion: 'GET /api/robot/posicion',
                detecciones: 'GET /api/robot/detecciones',
                estado: 'GET /api/robot/estado',
            },
            alertas: {
                crear: 'POST /api/alertas',
                obtener: 'GET /api/alertas',
                noLeidas: 'GET /api/alertas/no-leidas',
                marcarLeida: 'PUT /api/alertas/:id/leer',
                historial: 'GET /api/alertas/historial',
            },
            ia: {
                analizar: 'POST /api/ia/analizar',
                chat: 'POST /api/ia/chat',
                historial: 'GET /api/ia/historial',
                stats: 'GET /api/ia/stats',
            },
        },
        websocket: 'ws (mismo puerto que HTTP)',
        mqtt_broker: process.env.MQTT_BROKER || 'mqtt://localhost:1883',
    });
});

// Rutas privadas/protegidas
app.use('/api/auth', authRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/robot', robotRoutes);
app.use('/api/alertas', alertasRoutes);
app.use('/api/ia', iaRoutes);
// app.use('/api/sos', sosRoutes);

// Extra: endpoint AI
app.use('/requestToAI', requestToAI);

// Ruta raíz
app.get('/', (req, res) => {
    res.json({ 
        message: '🤖 Domus Backend API',
        version: '1.0.0',
        docs: '/api/docs',
        health: '/health'
    });
});

// 404
app.use((req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        ruta: req.path,
        metodo: req.method,
    });
});

// Errores
app.use((err, _req, res, _next) => {
    console.error('❌ Error:', err.message);
    res.status(err.status || 500).json({
        error: err.message || 'Error interno del servidor',
        timestamp: new Date(),
    });
});

// ==================
// INICIAR SERVIDOR
// ==================
const server = app.listen(PORT, async () => {
    console.log('\n' + '='.repeat(60));
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📊 Health:       http://localhost:${PORT}/health`);
    console.log(`📚 Docs:         http://localhost:${PORT}/api/docs`);
    console.log('='.repeat(60) + '\n');

    // Verificar conexión y DB
    console.log('🔍 Verificando conexión a Supabase...');
    const conexionOK = await verificarConexion();
    if (!conexionOK) {
        console.error('\n❌ No se pudo conectar a Supabase. Abortando...\n');
        process.exit(1);
    }

    console.log('📊 Inicializando base de datos...');
    const bdOK = await initializeDatabase();
    if (!bdOK) {
        console.error('\n❌ No se pudieron inicializar las tablas. Abortando...\n');
        process.exit(1);
    }

    console.log('✅ Verificando tablas...');
    const tablasOK = await verificarTablas();
    if (!tablasOK) {
        console.error('\n❌ Faltan tablas requeridas. Abortando...\n');
        console.log('💡 Ejecutá el SQL en Supabase SQL Editor');
        process.exit(1);
    }

    console.log('✅ ✅ ✅  SISTEMA COMPLETAMENTE LISTO PARA USAR  ✅ ✅ ✅\n');
    startMCP();
});

// ==================
// WEBSOCKETS sobre el MISMO server/puerto
// ==================
const wss = new WebSocketServer({ server });
wss.on('connection', (ws) => {
    console.log('✅ Cliente WebSocket conectado');
    ws.on('close', () => console.log('❌ Cliente WebSocket desconectado'));
});

// ==================
// MANEJO DE SEÑALES
// ==================
process.on('unhandledRejection', (reason) => {
    console.error('\n⚠️ Promise rechazada sin manejar:', reason);
    process.exit(1);
});

process.on('uncaughtException', (error) => {
    console.error('\n⚠️ Excepción no capturada:', error);
    process.exit(1);
});

process.on('SIGINT', () => {
    console.log('\n\n👋 Servidor apagándose gracefully...');
    wss.close();
    server.close(() => {
        console.log('✅ Servidor cerrado correctamente');
        process.exit(0);
    });
});
