const Koa = require("koa");
const Router = require("@koa/router");
const bodyParser = require("koa-bodyparser");
const serve = require("koa-static");
const send = require('koa-send');
const path = require("path");
const distDir = path.join(__dirname, "../client/dist");

const app = new Koa();

const router = new Router();
router.get("/api", async (ctx) => {
  ctx.body = "Hello World";
});

router.get("/api/about", async (ctx) => {
  ctx.body = {
    name: "Koa Demo",
    version: "1.0.0",
    description: "A simple Koa.js server",
  };
});

router.get("/api/data", async (ctx) => {
  ctx.body = {
    method: "GET",
    message: "Fetching data",
    timestamp: new Date(),
    data: { sampleData: "This is sample data" },
  };
});

router.post("/api/data", async (ctx) => {
  const receivedData = ctx.request.body; // Get the request body
  ctx.body = {
    method: "POST",
    message: "Creating new data",
    timestamp: new Date(),
    received: receivedData,
    status: "created",
  };
});

router.put("/api/data/:id", validateId("id"), async (ctx) => {
  const id = ctx.params.id;
  const receivedData = ctx.request.body;
  ctx.body = {
    method: "PUT",
    message: `Updating data with ID: ${id}`,
    timestamp: new Date(),
    id: id,
    received: receivedData,
    status: "updated",
  };
});

router.delete("/api/data/:id", validateId("id"), async (ctx) => {
  const id = ctx.params.id;
  ctx.body = {
    method: "DELETE",
    message: `Deleting data with ID: ${id}`,
    timestamp: new Date(),
    id: id,
    status: "deleted",
  };
});

// Logger middleware
app.use(async (ctx, next) => {
  const start = Date.now();
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    console.error('Error occurred:', err);
  } finally {
    const ms = Date.now() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ctx.status} - ${ms}ms`);
  }
});

// Frontend static file serving and SPA support
// 1️⃣ 提供整个 dist 目录下的静态资源
app.use(serve(distDir));
// 2️⃣ Enable body parser middleware
app.use(bodyParser());
// 3️⃣ Register router middleware
app.use(router.routes());
app.use(router.allowedMethods());
// 4️⃣ 对所有未命中的路由，返回 index.html（SPA 支持）
app.use(async (ctx) => {
  // 如果前面中间件已经处理了响应，就直接返回
  if (ctx.status !== 404) return;
  // 如果请求以 /api 或 /assets 开头，就不要回退
  if (ctx.path.startsWith("/api") || ctx.path.startsWith("/assets")) {
    ctx.status = 404;
    ctx.body = { error: "Not Found", path: ctx.path };
    return;
  }
  if (ctx.status === 404) {
    await send(ctx, "index.html", {
      root: distDir,
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Simple ID validation middleware generator
function validateId(paramName = "id") {
  return async (ctx, next) => {
    const val = ctx.params && ctx.params[paramName];
    if (!val) return await next();
    // Example validation: numeric only
    if (!/^\d+$/.test(val)) {
      ctx.status = 400;
      ctx.body = { error: "Invalid id format", param: paramName, value: val };
      return;
    }
    await next();
  };
}
