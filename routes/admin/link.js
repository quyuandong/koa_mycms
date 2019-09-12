let router = require("koa-router")();
let DB = require("../../model/db")
let tools = require("../../model/tools")

let multer = require("koa-multer"); //文件上传

//文件上传
//配置
let storage = multer.diskStorage({
    //文件保存路径
    destination: function(req,file,cb){
        cb(null,'public/uploads');
    },

    //修改文件名称
    filename:function(req,file,cb){
        let fileFormat = (file.originalname).split(".");    //以点进行分割成数组，数组的最后一项就是后缀名
        cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);   //对文件从新进行命名 时间加文件后缀
    }
})

//加载文件上传配置
let upload = multer({storage:storage})


//二级路由
//友情链接列表
router.get("/",async (ctx)=>{

    let page = ctx.query.page || 1;
    let pageSize = ctx.query.pageSize || 5;

    //获取所有的新闻信息
    let findRetult = await DB.find("link",{},{},{
        page,
        pageSize,
        sortJson:{
            'add_time':-1
        }
    });

    let s = ctx.state.AdminInfo.referer
    if(findRetult.length==0 && page !=1){
        page = page-1;
        ctx.redirect(s.substr(0,s.length-1)+page)
    }
    
    let allCount = await DB.count("link",{});

    let  totalPages = Math.ceil(allCount/pageSize); //总页数

    // 渲染数据
    await ctx.render("admin/link/list",{
        list:findRetult,
        page:page,
        totalPages:totalPages,

    });
})


//渲染添加友情链接页面
router.get("/add",async (ctx)=>{


    await ctx.render("admin/link/add");
});


//添加友情链接逻辑
router.post("/doAdd", upload.single("pic") ,async (ctx,next)=>{
    console.log(ctx.req.body.title);
    
    let title = ctx.req.body.title.trim();
    let url = ctx.req.body.url;
    let status = ctx.req.body.status;
    let sort = ctx.req.body.sort;
    let pic = ctx.req.file ? ctx.req.file.path.substr(7) : "";

    let add_time = tools.getTime();
    let josn = {
        title,url,status,sort,pic,add_time
    }
    
    await DB.insert("link",josn)
    ctx.redirect(ctx.state.__HOST__+"/admin/link")

});


//渲染编辑友情链接表单
router.get("/edit",async (ctx)=>{
    
    let findResult = await DB.find("link",{"_id":DB.getObjectId(ctx.query.id)})
    
    await ctx.render("admin/link/edit",{
        list: findResult[0],
        prePage:ctx.state.AdminInfo.referer,
    })
})


//编辑友情链接逻辑
router.post("/doEdit",upload.single("pic"),async (ctx)=>{
    let prePage = ctx.req.body.prePage; //编辑的页面
    let id = ctx.req.body.id;
    let url = ctx.req.body.url;
    let status = ctx.req.body.status;
    let sort = ctx.req.body.sort;
    let pic = ctx.req.file ? ctx.req.file.path.substr(7) : "";
    let json = {};
    if(pic){
        json = {
            title,url,status,sort,pic
        }
    }else{
        json = {
            title,url,status,sort
        }
    }
    

    await DB.update("link",{"_id":DB.getObjectId(id)},json)

    ctx.redirect(prePage)
})



//导出路由
module.exports = router.routes();