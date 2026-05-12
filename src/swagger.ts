import swaggerJSDoc from 'swagger-jsdoc';
import { Express, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import { version } from '../package.json';
 
const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Plus MS Auth API',
      version: '1.0.0',
      description: 'Documentação do Microsserviço de Autenticação para a loja plus size',
    },
    components: {
      schemas: {
        UserDto: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'aluno@pucrs.br' },
            password: { type: 'string', example: 'senha123' },
          },
        },
        UserResponseDto: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            message: { type: 'string' },
          },
        },
      },
      securitySchemas: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
        {
            bearerAuth: []
        }
    ],
  },
  apis: ['./src/index.ts', './src/controllers/*.ts'], 
};

export const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app: Express, port: number){
    // Swagger page
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Docs in JSON format
    app.get('/docs.json', (req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json')
        res.send(swaggerSpec);
    })
}

export default swaggerDocs;