const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    swagger: "2.0",
    info: {
      description: "API Gateway and Microservices Documentation",
      version: "1.0.0",
      title: "API Gateway"
    },
    host: "localhost:3000",
    paths: {
      "/api/users": {
        "get": {
          "summary": "Get all users",
          "responses": {
            "200": {
              "description": "successful operation"
            }
          }
        }
      },
      "/api/products": {
        "get": {
          "summary": "Get all products",
          "responses": {
            "200": {
              "description": "successful operation"
            }
          }
        }
      },
      "/api/orders": {
        "get": {
          "summary": "Get all orders",
          "responses": {
            "200": {
              "description": "successful operation"
            }
          }
        }
      }
    }
  },
  apis: ["./routes/*.js"] // path to your API routes
};

function setupSwagger(app) {
  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}

module.exports = setupSwagger;