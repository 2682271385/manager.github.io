let express=require('express');
let path=require('path');
let svgCaptcha=require('svg-captcha')
var bodyParser = require('body-parser')
let session = require('express-session')
// const MongoClient = require('mongodb').MongoClient;
// const url = 'mongodb://localhost:27017';
// const dbName = 'test';
let indexRouter=require(path.join(__dirname,'/routers/indexRouter'));
let myT=require(path.join(__dirname,'tools/myT'))
let app=express();

app.engine('html', require('express-art-template'));
app.set('views', '/static/views'
);

app.use(express.static('static'));
//存取session的中间件
app.use(session({
    secret: 'keyboard cat',
}))
//获取post数据的中间件
app.use(bodyParser.urlencoded({ extended: false }))
// 主页面中间件路由
app.use('/index',indexRouter);
//登录界面路由
app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,'static/views/login.html'));
})

//登录判定路由
app.post('/login',(req,res)=>{
    let userName=req.body.userName;
    let password=req.body.password;
    let code=req.body.code;
    console.log(code)
    if(code==req.session.captcha){
        myT.find('papapa',{userName,password},(err,docs)=>{
            if(!err){
                console.log(docs)
                if(docs.length==1){
                    req.session.userInfo={
                        userName
                    }
                }
            }
            res.redirect('/index')
        })
    }else{
        res.redirect('/login')
    }
})
//设置验证码路由
app.get('/login/captcha', function (req, res) {
    var captcha = svgCaptcha.create();
    req.session.captcha = captcha.text.toLocaleLowerCase();
    res.type('svg');
    res.status(200).send(captcha.data);
});
//主页面路由
// app.get('/index',(req,res)=>{
//     if(req.session.userInfo){    
//         res.sendFile(path.join(__dirname,'static/views/index.html'))
//     }else{
//         res.redirect('/login');
//     } 
// })

//登出页面路由
app.get('/logout',(req,res)=>{
    delete req.session.userInfo;
    res.redirect('/login');
})
//反回注册页面
app.get('/register',(req,res)=>{
    res.sendFile(path.join(__dirname,'static/views/register.html'));
})
//提交注册信息
app.post('/register',(req,res)=>{
    let userName=req.body.userName;
    let password=req.body.password;
    // MongoClient.connect(url, function(err, client) {
    //     const db = client.db(dbName);
    //     const collection = db.collection('papapa');
    //     collection.find({
    //         userName
    //     }).toArray(function(err, docs) {
    //         console.log(docs.length);
    //         if(docs.length==0){
    //             collection.insertOne({
    //                 userName,password
    //             }
    //             , function(err, result) {
    //                 console.log(err)
    //                   res.setHeader('content-type','text/html');
    //                   res.send("<script>window.location='/login'</script>")
    //             });
    //         }
    //     });
    // });
    myT.find('papapa',{userName},(err,docs)=>{
        console.log(docs.length);
        console.log(docs)
        console.log(err)
        if(docs.length==0){
            myT.insert('papapa',{userName,password},(err,result)=>{
                if(!err){
                    myT.mess(res,'注册成功','/login');
                }
            })
        }else{
            myT.mess(res,'已被注册回去养猪','/register')
        }
    })
    
})
//监听
app.listen(89,'127.0.0.1',()=>{
    console.log('success');
})
