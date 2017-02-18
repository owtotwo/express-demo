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
    username: String,
    password: String,
    age: Number
});

module.exports = User;