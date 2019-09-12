let router = require("koa-router")();
let DB = require("../../model/db")
let tools = require("../../model/tools")

//二级路由
//管理员列表
router.get("/",async (ctx)=>{

    //获取所有的管理员用户
    let result = await DB.find("admin",{})
    ctx.body = result.map(item=>{
        delete item.password;
        return item;
    });
})



//添加管理员信息
router.post("/add",async (ctx,next)=>{
    let username = ctx.request.body.username;
    let password = ctx.request.body.password;
    let rpassword = ctx.request.body.rpassword;

    if(!/^\w{4,18}/.test(username)){

        ctx.body = {
            message:"用户名不合法",
            status:"404",
            success:false,
        }
    }else if(password.length<6 || password != rpassword){
        ctx.body = {
            message:"两次密码不一致，或密码低于六位",
            status:"404",
            success:false,
        }
        
    }else{
        let findResult = await DB.find("admin",{"username":username});
        if(findResult.length>0){
            ctx.body = {
                message:"用户名已被注册，请更换用户名",
                status:"404",
                success:false,
            }
        }else{
           let insertResult =  await DB.insert("admin",{"username":username,"password":tools.md5(password),"status":1,last_time:""})
           if(insertResult){
                ctx.body = {
                    message:"恭喜你，添加成功！",
                    status:"200",
                    success:true,
                }
           }else{
                ctx.body = {
                    message:"服务器异常",
                    status:"500",
                    success:false,
                }
           }
            
        }
    }
    await next();
    
});


//编辑管理员信息
router.get("/edit",async (ctx)=>{
    
    let findResult = await DB.find("admin",{"_id":DB.getObjectId(ctx.query.id)})
    
    console.log(findResult.length>0);
    
    if(findResult.length>0){
       ctx.body = findResult.map((item)=>{
           delete item.password;
           return item;
       });
    }else{
        ctx.body = {
            message:"您编辑的数据不存在",
            status:"404",
            success:false
        }
    }
})


//更新管理员信息
router.post("/update",async (ctx)=>{
    let username = ctx.request.body.username;
    let password = ctx.request.body.password;
    let rpassword = ctx.request.body.rpassword;
    let id = ctx.request.body.id;

    if(password.length<6 || password != rpassword){

        ctx.body = {
            message:"两次密码不一致，或密码低于六位",
            status:"404",
            success:false,
        }
    }else{
        let updateResult =  await DB.update("admin",{"_id":DB.getObjectId(id)},{"password":tools.md5(password)})
        if(updateResult){
            ctx.body = {
                message:"更新成功",
                status:"200",
                success:true,
            }
        }
        
    }
})



//导出路由
module.exports = router.routes();