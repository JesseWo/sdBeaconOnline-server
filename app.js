// 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示:
const Koa = require('koa');
// 创建一个Koa对象表示web app本身:
const app = new Koa();

const bodyParser = require('koa-bodyparser');
const controller = require('./controller');
const dateUtils = require('./utils/dateUtils');

// 对于任何请求，app将调用该异步函数处理请求：
app.use(async (ctx, next) => {
    await next();
    console.log(`${dateUtils.getCurrentTime()} ${ctx.request.method} ${ctx.request.url}`);
});

//parse request body
app.use(bodyParser());

// add router middleware:
app.use(controller())

// 在端口3000监听:
app.listen(3110);

console.log('app started at port 3110...');