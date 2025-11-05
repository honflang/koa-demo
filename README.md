# Koa Demo

A simple Koa.js server demonstrating routing, middleware, validation, and error handling.

## Features
- Basic Koa server setup
- Logger middleware
- Route handling with @koa/router
- Request body parsing with koa-bodyparser
- ID validation middleware
- Catch-all 404 error handler

## Getting Started

### Install dependencies
```bash
npm install
```

### Run the server
```bash
npm start
```

### Example Endpoints
- `GET /api` — Hello World
- `GET /api/about` — App info
- `GET /api/data` — Sample data
- `POST /api/data` — Create data (JSON body)
- `PUT /api/data/:id` — Update data (numeric id, JSON body)
- `DELETE /api/data/:id` — Delete data (numeric id)
