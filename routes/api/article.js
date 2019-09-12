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

    let currentPage = ctx.query.currentPage || 1;
    let pageSize = ctx.query.pageSize || 5;             //每页5条   
    let sortJson = ctx.query.sortJson ||  'add_time';   //排序条件   
    let sortRouse = ctx.query.sortRouse ||  1;            //排序规则   

    //获取所有的新闻信息
    let findRetult = await DB.find("article",{},{},{
        currentPage,
        pageSize,
        sortJson:{
            [sortJson]:sortRouse
        }
    });
    
    let allCount = await DB.count("article",{});
    let  totalPages = Math.ceil(allCount/pageSize); //总页数

    let json = {
        articleList:findRetult,
        currentPage:currentPage,
        totalPages:totalPages,
    }
    ctx.body = json;
})


//添加文章逻辑
router.post("/add", upload.single("img_url") ,async (ctx,next)=>{

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
    
    let insertResult = await DB.insert("article",josn);
    if(insertResult.length>0){
        ctx.body = {
            message:"内容添加成功！",
            status:"200",
            success:true,
        }
    }else{
        ctx.body = {
            message:"内容添加失败！",
            status:"404",
            success:false,
        }
    }

});


//渲染编辑文章表单
router.get("/edit",async (ctx)=>{
    
    let findResult = await DB.find("article",{"_id":DB.getObjectId(ctx.query.id)})
    if(findResult.length>0){
        ctx.body = findResult;
    }else{
        ctx.body = {
            message:"查找的信息不存在",
            status:"404",
            success:false,
        }
    }
})


//编辑文章逻辑
router.post("/update",upload.single("img_url"),async (ctx)=>{
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
    

    let updateResult = await DB.update("article",{"_id":DB.getObjectId(id)},json)

    if(updateResult){
        ctx.body = {
            message:"更新成功",
            status:"200",
            success:true,
        }
    }else{
        ctx.body = {
            message:"更新失败",
            status:"404",
            success:false,
        }
    }
})



//导出路由
module.exports = router.routes();