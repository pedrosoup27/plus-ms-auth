"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const options = {
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
            securitySchemes: {
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
    apis: [
        './src/index.ts',
        './dist/index.js',
        './src/controllers/*.ts',
        './dist/controllers/*.js'
    ],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
function swaggerDocs(app, port) {
    // Swagger page
    app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(exports.swaggerSpec));
    // Docs in JSON format
    app.get('/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(exports.swaggerSpec);
    });
}
exports.default = swaggerDocs;
