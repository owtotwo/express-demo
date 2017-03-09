// login.js

var express = require('express');
// 创建处理/login的路由本体
var router = express.Router();
// 使用用户类模型
var User = require('../models/User');

// 在/login路径下解析根目录（即此路径本身）
router.route('/')
    .get((req, res, next) => {
        // 如果已经登录那么就直接重定向至首页
        if (req.isAuthorized)
            res.redirect('/');
        else
            res.render('login', { title: 'Login' });
    })
    .post((req, res, next) => {
        console.log('Requset to login a user: \n' + 
                    '  Username: %s\n' + 
                    '  Password: %s\n',
                    req.body.username, 
                    req.body.password);
        User.findOne({ username: req.body.username }, (err, user) => {
            if (err) {
                console.log(err);
                res.send('数据库查询出错，可能不存在此用户');
                return;
            }
            if (req.body.password !== user.password) {
                console.log('密码错误');
                res.send('密码错误');
                return;
            }
            console.log('登录成功');
            // 为用户设置一个cookie作为通行证，signed表示为此cookie签名（使用uims_secret)
            res.cookie('username', user.username);
            res.cookie('alive', user.username, { signed: true });
            // 成功登录则重定向至主页
            res.redirect('/');
        });
    });

// 作为package供app.js使用
module.exports = router;