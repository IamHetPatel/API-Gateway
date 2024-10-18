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
      "/api/users/register": {
      "post": {
        "summary": "Register a new user",
        "parameters": [
          {
            "in": "body",
            "name": "user",
            "description": "User registration",
            "schema": {
              "$ref": "#/definitions/User"
            }
          }
        ],
        "responses": {
          "201": { "description": "User created" },
          "500": { "description": "Error" }
        }
      }
    },
    "/api/users/login": {
      "post": {
        "summary": "Login a user",
        "parameters": [
          {
            "in": "body",
            "name": "login",
            "description": "User login",
            "schema": {
              "$ref": "#/definitions/Login"
            }
          }
        ],
        "responses": {
          "200": { "description": "Token" },
          "400": { "description": "Invalid credentials" }
        }
      }
    },
    "/api/orders/user/:id": {
      "get": {
        "summary": "Get orders for the logged-in user",
        "responses": {
          "200": { "description": "Orders" },
          "500": { "description": "Error" }
        }
      }
    },
    "/api/orders": {
      "post": {
        "summary": "Create a new order",
        "parameters": [
          {
            "in": "body",
            "name": "order",
            "description": "Order details",
            "schema": {
              "$ref": "#/definitions/Order"
            }
          }
        ],
        "responses": {
          "201": { "description": "Order created" },
          "500": { "description": "Error" }
        }
      },
    },
    "/api/products": {
      "post": {
        "summary": "Create a new product",
        "parameters": [
          {
            "in": "body",
            "name": "product",
            "description": "Order details",
            "schema": {
              "$ref": "#/definitions/Product"
            }
          }
        ],
        "responses": {
          "201": { "description": "Product created" },
          "500": { "description": "Error" }
        }
      },
    }
  },
  definitions: {
    "User": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "email": { "type": "string" },
        "password": { "type": "string" }
      }
    },
    "Login": {
      "type": "object",
      "properties": {
        "email": { "type": "string" },
        "password": { "type": "string" }
      }
    },
    "Order": {
      "type": "object",
      "properties": {
        "products": {
          "type": "array",
          "items": { "type": "object", "properties": { "productId": { "type": "string" }, "quantity": { "type": "integer" } } }
        }
      }
    },
    "Product": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "price": { "type": "number" },
        "stock": { "type": "number" }
      }
    }
  },
  },
  apis: ["./routes/*.js"] // path to your API routes
};

function setupSwagger(app) {
  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}

module.exports = setupSwagger;