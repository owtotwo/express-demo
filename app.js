// app.js

// 引入必要的express库
var express = require('express');
// 引入morgan作为logger
var logger = require('morgan');
// 引入nodejs自带的path处理库
var path = require('path');
// 引入处理/register路径的路由
var register = require('./routes/register');
// 引入处理/login路径的路由
var login = require('./routes/login');
// 引入body-parser来解析post请求
var bodyParser = require('body-parser');
// 引入cookie-parser来解析判断登录状态的cookie字段
var cookieParser = require('cookie-parser');

// 创建app
app = express();

// 设置app的settings的views值（模板文件存放的路径）以供模板引擎使用
app.set('views', path.join(__dirname, 'views'));
// 设置模板引擎为jade
app.set('view engine', 'jade');

// 在app的最前面使用打log的中间件并设置log的格式为'dev'，其他格式请看官方文档
app.use(logger('dev'));
// 使用其中的URL-Parser
app.use(bodyParser.urlencoded({ extended: false }));
// 使用cookie-parser中间件
app.use(cookieParser('uims_secret'));

// 为所有请求添加req.isAuthorized参数，通过判断是否携带含alive和username字段的cookie
app.use((req, res, next) => {
    if (req.signedCookies.alive && req.signedCookies.alive == req.cookies.username) {
        req.isAuthorized = true;
    } else {
        req.isAuthorized = false;
    }
    next();
});

// 为处理/register路径添加路由
app.use('/register', register);
// 为处理/login路径添加路由
app.use('/login', login);

// 拦截未登录用户，未登录的请求直接重定向至登录页面
// 注：此中间件后面的路由只有登录后才能访问
app.use((req, res, next) => {
    if (!req.isAuthorized)
        res.redirect('/login');
    else
        next();
});

// 分析根路径的url的get请求，箭头函数请学习ES6，下同
app.get('/', (req, res, next) => res.send('Hello UIMS!'));

// 已登录的用户请求/logout时即为它清除响应的cookies
app.get('/logout', (req, res) => {
    res.clearCookie('username');
    res.clearCookie('alive');
    // 登出后重定向至登录页面
    res.redirect('/login');
});

// 假若上面的中间件（路由等）中没有结束，那就无条件地进入到这个中间件，除错误处理中间件以外，其
// 他的中间件都是三个参数。
app.use((req, res, next) => {
    // 创建一个错误并向后传递
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// 错误处理中间件
app.use((err, req, res, next) => {
    // 状态码500也就是服务器炸了的意思，双竖线是短路操作
    res.status(err.status || 500);
    // 设置生命周期为res的生命周期的局部变量，以供模板error.jade使用
    res.locals.message = err.message;
    // 同上，并且当运行环境为开发环境时才设置局部变量error
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // 渲染模板error.jade并响应
    res.render('error');
});

// 监听端口3000并输入提示日志
app.listen(3000, () => console.log('listening at http://localhost:3000/'));
