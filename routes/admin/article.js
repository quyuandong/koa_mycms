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
//文章列表
router.get("/",async (ctx)=>{

    let page = ctx.query.page || 1;
    let pageSize = 5;   //每页5条   

    //获取所有的新闻信息
    let findRetult = await DB.find("article",{},{},{
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

    let allCount = await DB.count("article",{});
    let  totalPages = Math.ceil(allCount/pageSize); //总页数

    // 渲染数据
    await ctx.render("admin/article/list",{
        list:findRetult,
        page:page,
        totalPages:totalPages,

    });
})


//渲染添加文章页面
router.get("/add",async (ctx)=>{
    let cateList = await DB.find("articlecate",{})

    await ctx.render("admin/article/add",{
        cateList:cateList
    });
});


//添加文章逻辑
router.post("/doAdd", upload.single("file") ,async (ctx,next)=>{

    console.log(ctx.req.body);
    let pid = ctx.req.body.pid;
    let title = ctx.req.body.title.trim();
    let author = ctx.req.body.author.trim();
    let status = ctx.req.body.status;
    let is_best = ctx.req.body.is_best;
    let is_hot = ctx.req.body.is_hot;
    let is_new = ctx.req.body.is_new;
    let content = ctx.req.body.content || "";
    let keywords = ctx.req.body.keywords;
    let description = ctx.req.body.description || "";
    let img_url = ctx.req.file ? ctx.req.file.path.substr(7) : "";
    let add_time = tools.getTime();
    let cateResult = await DB.find("articlecate",{"_id":DB.getObjectId(pid)});
    let catename = cateResult[0].title;
    let josn = {
        pid,catename,title,author,status,is_best,is_hot,is_new,keywords,description,content,img_url,add_time
    }
    
    await DB.insert("article",josn)
    ctx.redirect(ctx.state.__HOST__+"/admin/article")

});


//渲染编辑文章表单
router.get("/edit",async (ctx)=>{
    
    let findResult = await DB.find("article",{"_id":DB.getObjectId(ctx.query.id)})
    let cateResult = await DB.find("articlecate",{})
    
    await ctx.render("admin/article/edit",{
        list: findResult[0],
        cateList:cateResult,
        prePage:ctx.state.AdminInfo.referer,
    })
})


//编辑文章逻辑
router.post("/doEdit",upload.single("img_url"),async (ctx)=>{
    let prePage = ctx.req.body.prePage; //编辑的页面
    let id = ctx.req.body.id;
    let pid = ctx.req.body.pid;
    let title = ctx.req.body.title.trim();
    let author = ctx.req.body.author.trim();
    let status = ctx.req.body.status;
    let is_best = ctx.req.body.is_best;
    let is_hot = ctx.req.body.is_hot;
    let is_new = ctx.req.body.is_new;
    let content = ctx.req.body.content || "";
    let keywords = ctx.req.body.keywords;
    let description = ctx.req.body.description || "";
    let img_url = ctx.req.file ? ctx.req.file.path.substr(7) : "";
    let cateResult = await DB.find("articlecate",{"_id":DB.getObjectId(pid)});
    let catename = cateResult[0].title;
    let json = {};
    if(img_url){
        json = {
            pid,catename,title,author,status,is_best,is_hot,is_new,keywords,description,content,img_url
        }
    }else{
        json = {
            pid,catename,title,author,status,is_best,is_hot,is_new,keywords,description,content
        }
    }
    

    await DB.update("article",{"_id":DB.getObjectId(id)},json)

    ctx.redirect(prePage)
})



//导出路由
module.exports = router.routes();