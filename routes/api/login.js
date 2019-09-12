let router = require("koa-router")();
let DB = require("../../model/db");
let svgCaptcha = require("svg-captcha");    //验证码
let tools = require("../../model/tools");   //工具类


//处理用户登录时的信息
router.post("/login", async (ctx)=>{
    let username = ctx.request.body.username;
    let password = ctx.request.body.password;
    let code = ctx.request.body.code;

    if(code.toLocaleLowerCase() == ctx.session.code.toLocaleLowerCase()){
        let result = await DB.find("admin",{"username":username,"password":tools.md5(password)});
        if(result.length>0){

            //判断当前用户的状态是否合法，正常状态允许登录，不正常状态不允许登录
            if(result[0].status == 0){

                ctx.body = {
                    message:"此用户已被临时注销，请与客服联系",
                    status:"404",
                    success:false,
                }
            }else{
                ctx.session.userinfo = result[0];
                ctx.session.loginTime = new Date();
                ctx.body = result.map(item=>{
                    delete item.password;
                    return item;
                })
            }

            
        }else{
            //账号密码不正确
            ctx.body = {
                message:"用户名或密码错误",
                status:"404",
                success:false,
            }
        }
    }else{
        //验证码不正确
        ctx.body = {
            message:"验证码错误",
            status:"404",
            success:false,
        }
        

    }   
    
})


//生成验证码
router.get("/code", async (ctx,next)=>{
    // let captcha = svgCaptcha.createMathExpr();  //数学公式验证 
    let width = ctx.query.width || 100;
    let height = ctx.query.height || 40;
    let fontSize = ctx.query.fontSize || 40;
    let captcha = svgCaptcha.create({
        width:width,
        height:height,
        fontSize:fontSize,
    });
    //保存验证码
    ctx.session.code = captcha.text;
    //设置响应头
    ctx.response.type = "image/svg+xml"
    //响应验证码
    ctx.body = captcha.data;
    await next();
})



//退出登录
router.get("/loginOut",async (ctx,next)=>{

    if(ctx.session.userinfo){
        let loginTime = ctx.session.loginTime;
        await DB.update("admin",{"_id":DB.getObjectId(ctx.session.userinfo._id)},{last_time:loginTime})
        ctx.session.userinfo = "";  //清空数据
        
        ctx.body = {
            message:"退出登录成功",
            status:"200",
            success:true,
        }
    }else{
        ctx.body = {
            message:"你没用进行登录，无法进行退出",
            status:"404",
            success:false,
        }
    }
    

})


//导出路由
module.exports = router.routes();

