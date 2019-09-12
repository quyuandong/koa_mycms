let router = require("koa-router")();

//二级路由
//用户主界面
router.get("/",async (ctx)=>{
    // ctx.body = "user";
    await ctx.render("admin/user/index");
})

//添加用户
router.get("/add",async (ctx)=>{
    // ctx.body = "user";
    await ctx.render("admin/user/add")
});

//编辑用户
router.get("/edit",async (ctx)=>{
    ctx.body = "user";
})

//删除用户
router.get("/delete",async (ctx)=>{
    ctx.body = "user";
})


//导出路由
module.exports = router.routes();