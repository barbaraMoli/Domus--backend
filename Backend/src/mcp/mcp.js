import { MCPServer } from '@modelcontextprotocol/sdk/dist/cjs/index.js';

const server = new MCPServer({
    name: 'demo-mcp',
    version: '1.0.0'
});

server.tool('sayHello', async (params) => {
    const name = params.name || 'Santino';
    return { message: `Hola ${name}, ¿Cómo estás?` }
});

export function startMCP() {
    server.start();
    console.log('✅ Servidor MCP iniciado correctamente');
};
