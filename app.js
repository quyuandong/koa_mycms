let Koa = require("koa");
let router = require("koa-router")(); //引入router并进行实例化
let static = require("koa-static");   //静态资源
let path = require("path");
let render = require("koa-art-template");   //引入模板引擎
let bodyparser = require("koa-bodyparser"); //接收post请求提交的数据
let session = require("koa-session");       //session的操作
let sd = require("silly-datetime");         //art模板引擎格式化


//实例化一个koa 
let app = new Koa();

//配置session中间件
app.keys = ["some secret hurr"];
let CONFIG = {
    key: "koa:sess",    //加密
    autoCommit: true,
    maxAge: 86400000,   //session生命周期
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: true,  //每次请求都需要重新给个session
    renew: false,
}

app.use(session(CONFIG,app))

//配置Post提交数据的中间件
app.use(bodyparser());



//配置模板引擎
render(app,{
    root:path.join(__dirname,"views"),
    extname:".html",
    dubug: process.env.NODE_ENV !== "production",
    dateFormat: dateFormat = function(value){
        return sd.format(value,"YYYY-MM-DD     HH:mm:ss");
    }
})

//托管静态资源
app.use(static(__dirname+"/public"))

//引入路由模块
let index = require("./routes/index");  //前台入口
let admin = require("./routes/admin");  //后台入口
let api = require("./routes/api");  //api入口

//创建一级路由
router.use(index);
router.use("/admin",admin);
router.use("/api",api);

//启动路由
app.use(router.routes());
app.use(router.allowedMethods())
 
//app.listen(3000,()=>{
//    console.log("服务已经启动..."); 
//})

module.exports = app;