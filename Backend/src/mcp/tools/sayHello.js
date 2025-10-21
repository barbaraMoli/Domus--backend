import { z } from 'zod';

export const sayHelloTool = {
    name: "sayHello",
    title: "Saludo",
    description: "Devuelve un saludo personalizado",
    inputSchema: { name: z.string().optional() },
    outputSchema: { message: z.string() },
    run: async ({ name }) => {
        const message = `Hola ${name || "Santino"}, ¿cómo estás?`;
        return {
            content: [{ type: "text", text: message }],
            structuredContent: { message },
        };
    },
};
