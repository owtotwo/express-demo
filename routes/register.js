// register.js

var express = require('express');
// 创建处理/register的路由本体
var router = express.Router();
// 使用用户类模型
var User = require('../models/User');

// 在/register路径下解析根目录（即此路径本身）
router.route('/')
    .get((req, res, next) => {
        res.render('register', { title: 'Register' });
    })
    .post((req, res, next) => {
        console.log('Requset to register a user: \n' + 
                    '  Username: %s\n' + 
                    '  Password: %s\n' + 
                    '  Age:      %d\n',
                    req.body.username, 
                    req.body.password, 
                    req.body.age);
        // 密码确认
        if (req.body['password'] !== req.body['password again']) {
            res.send('两次输入的密码不一致');
        }
        // 创建新用户
        var user = new User({
            username: req.body.username,
            password: req.body.password,
            age: req.body.age
        });
        // 保存新用户到数据库中
        user.save((err) => {
            if (err) {
                console.log('Failed to save the new user `%s`', user.username);
                res.send('注册失败');
            } else {
                console.log('Save the new user `%s`', user.username);
                //注册成功则重定向至登录页
                res.redirect('/login');
            }
        });
    });

// 作为package供app.js使用
module.exports = router;