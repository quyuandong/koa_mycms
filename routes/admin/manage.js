let router = require("koa-router")();
let DB = require("../../model/db")
let tools = require("../../model/tools")

//二级路由
//管理员列表
router.get("/",async (ctx)=>{

    //获取所有的管理员用户
    let retult = await DB.find("admin",{})

    await ctx.render("admin/manage/list",{
        list: retult
    });
})


//渲染添加管理员页面
router.get("/add",async (ctx)=>{
    // ctx.body = "添加管理员";
    await ctx.render("admin/manage/add")
});

//添加管理员逻辑
router.post("/doAdd",async (ctx,next)=>{
    let username = ctx.request.body.username;
    let password = ctx.request.body.password;
    let rpassword = ctx.request.body.rpassword;

    if(!/^\w{4,18}/.test(username)){
        ctx.render("admin/error",{
            message:"用户名不合法",
            redirect:ctx.state.__HOST__+"/admin/manage/add"
        })
    }else if(password.length<6 || password != rpassword){
        ctx.render("admin/error",{
            message:"两次密码不一致，或密码低于六位",
            redirect:ctx.state.__HOST__+"/admin/manage/add"
        })
    }else{
        let findResult = await DB.find("admin",{"username":username});
        if(findResult.length>0){
            ctx.render("admin/error",{
                message:"用户名已被注册，请更换用户名",
                redirect:ctx.state.__HOST__+"/admin/manage/add"
            })
        }else{
            await DB.insert("admin",{"username":username,"password":tools.md5(password),"status":1,last_time:""})
            ctx.redirect(ctx.state.__HOST__+"/admin/manage")
        }
    }

    await next();
    
});


//渲染编辑管理员表单
router.get("/edit",async (ctx)=>{
    
    let findResult = await DB.find("admin",{"_id":DB.getObjectId(ctx.query.id)})
    
    await ctx.render("admin/manage/edit",{
        list: findResult[0]
    })
})


//编辑管理员逻辑
router.post("/doEdit",async (ctx)=>{
    let username = ctx.request.body.username;
    let password = ctx.request.body.password;
    let rpassword = ctx.request.body.rpassword;
    let id = ctx.request.body.id;

    if(password.length<6 || password != rpassword){
        ctx.render("admin/error",{
            message:"两次密码不一致，或密码低于六位",
            redirect:ctx.state.__HOST__+"/admin/manage/add"
        })
    }else{
            await DB.update("admin",{"_id":DB.getObjectId(id)},{"password":tools.md5(password)})
            ctx.redirect(ctx.state.__HOST__+"/admin/manage")
        }
})



//导出路由
module.exports = router.routes();