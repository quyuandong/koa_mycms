let router = require("koa-router")();
let DB = require("../../model/db");
let svgCaptcha = require("svg-captcha");    //验证码
let tools = require("../../model/tools");   //工具类


//二级路由
router.get("/",async (ctx)=>{
    // ctx.body = "login";
    await ctx.render("admin/login")
})

//处理用户登录时的信息
router.post("/doLogin", async (ctx)=>{
    let username = ctx.request.body.username;
    let password = ctx.request.body.password;
    let code = ctx.request.body.code;


    if(code.toLocaleLowerCase() == ctx.session.code.toLocaleLowerCase()){
        let result = await DB.find("admin",{"username":username,"password":tools.md5(password)});
        if(result.length>0){

            //判断当前用户的状态是否合法，正常状态允许登录，不正常状态不允许登录
            if(result[0].status == 0){
                ctx.render("admin/error",{
                    message:"此用户已被临时注销，请与客服联系",
                    redirect:ctx.state.__HOST__+"/admin/login"
                })
            }else{
                ctx.session.userinfo = result[0];
                ctx.session.loginTime = new Date();
                ctx.redirect(ctx.state.__HOST__+"/admin")
            }

            
        }else{
            //账号密码不正确
            ctx.render("admin/error",{
                message:"用户名或密码错误",
                redirect:ctx.state.__HOST__+"/admin/login"
            })
        }
    }else{
        //验证码不正确
        ctx.render("admin/error",{
            message:"验证码错误",
            redirect:ctx.state.__HOST__+"/admin/login"
        })
    }   
    
})

//生成验证码
router.get("/code", async (ctx,next)=>{
    // let captcha = svgCaptcha.createMathExpr();  //数学公式验证 
    let captcha = svgCaptcha.create({
        width:100,
        height:40,
        fontSize:40,
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

    let loginTime = ctx.session.loginTime;
    await DB.update("admin",{"_id":DB.getObjectId(ctx.session.userinfo._id)},{last_time:loginTime})
    ctx.session.userinfo = "";  //清空数据
    ctx.redirect(ctx.state.__HOST__+"/admin/login");

    await next();
})

//导出路由
module.exports = router.routes();

