// User.js

// 引入mongoose来驱动mongoDB
var mongoose = require('mongoose');

// 连接到数据库，具体host和端口请参考自己系统中的mongoDB服务进程信息。
// 若数据库不存在则会自动创建一个新数据库
mongoose.connect('mongodb://127.0.0.1:27017/uims');

// 判断连接成功与否
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Success to Connect the MongoDB...');
});

// 创建用户类模型
var User = mongoose.model('User', {
    username: {
        type: String, 
        required: true, 
        unique: true,
        match: [
            /^[0-9a-zA-Z_]+$/, 
            '用户名仅允许使用数字字母以及下划线的组合，不能为空'
        ]
    },
    password: { 
        type: String, 
        required: true,
        validate: {
            validator: (pwd) => {
                if (pwd.length() < 6 || pwd.length() > 18)
                    return false;
                return /[a-zA-Z]/.test(pwd) && /[0-9]/.test(pwd);
            },
            message: '密码长度为[6, 18]，需要包含至少一个字母一个数字'
        }
    },
    age: { 
        type: Number, 
        min: [ 0, '年龄必须为非负数' ] 
    }
});

module.exports = User;