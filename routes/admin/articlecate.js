let router = require("koa-router")();
let DB = require("../../model/db")
let tools = require("../../model/tools")

//二级路由
//管理员列表
router.get("/",async (ctx)=>{

    //获取所有的文章标题
    let result = await DB.find("articlecate",{})
    //将获取到的数据进行格式化
    let dataResulet = tools.cateToList(result);

    //渲染数据
    await ctx.render("admin/articlecate/list",{
        list: dataResulet
    });
})


//渲染添加管理员页面
router.get("/add",async (ctx)=>{
    // ctx.body = "添加管理员";
    
    let findResult = await DB.find("articlecate",{"pid":"0"})
    
    await ctx.render("admin/articlecate/add",{
        cateList : findResult
    })
});

//添加管理员逻辑
router.post("/doAdd",async (ctx,next)=>{
    let addData = ctx.request.body
    await DB.insert("articlecate",addData)
    ctx.redirect(ctx.state.__HOST__+"/admin/articlecate")

});


//渲染编辑管理员表单
router.get("/edit",async (ctx)=>{
    
    let findResult = await DB.find("articlecate",{"_id":DB.getObjectId(ctx.query.id)})
    let cateResult = await DB.find("articlecate",{"pid":"0"})
    await ctx.render("admin/articlecate/edit",{
        list: findResult[0],
        cateList:cateResult,
    })
})


//编辑管理员逻辑
router.post("/doEdit",async (ctx)=>{
    let editData = ctx.request.body;
    
    let id = editData.id;
    let title = editData.title;
    let pid = editData.pid;
    let keywords = editData.keywords;
    let status = editData.status;
    let description = editData.description;

    await DB.update("articlecate",{"_id":DB.getObjectId(id)},{
        title,pid,keywords,status,description
    })

    ctx.redirect(ctx.state.__HOST__+"/admin/articlecate")
})



//导出路由
module.exports = router.routes();