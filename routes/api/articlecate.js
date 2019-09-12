let router = require("koa-router")();
let DB = require("../../model/db")
let tools = require("../../model/tools")

//二级路由
//管理员列表
router.get("/",async (ctx)=>{
    //获取所有的文章标题
    let result = await DB.find("articlecate",{})
    ctx.body = result;
})



//添加管理员逻辑
router.post("/add",async (ctx,next)=>{

    let addData = ctx.request.body
    let insertResult = await DB.insert("articlecate",addData)
    if(insertResult){
        ctx.body = {
            message:"插入成功",
            status:"200",
            success:true,
        }
    }else{
        ctx.body = {
            message:"插入失败",
            status:"404",
            success:false,
        }
    }
    

});


//编辑管理员逻辑
router.post("/doEdit",async (ctx)=>{
    let editData = ctx.request.body;
    
    let id = editData.id;
    let title = editData.title;
    let pid = editData.pid;
    let keywords = editData.keywords;
    let status = editData.status;
    let description = editData.description;

    let updateResult = await DB.update("articlecate",{"_id":DB.getObjectId(id)},{
        title,pid,keywords,status,description
    })

    if(updateResult){
        ctx.body = {
            message:"操作成功",
            status:"200",
            success:true,
        }
    }else{
        ctx.body = {
            message:"操作失败",
            status:"404",
            success:false,
        }
    }
})



//导出路由
module.exports = router.routes();