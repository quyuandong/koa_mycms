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

    let currentPage = ctx.query.page || 1;
    let pageSize = ctx.query.pageSize || 5;   //每页5条   
    let sortJson = ctx.query.sortJson || 'add_time';
    let sortRouse = ctx.query.sortRuse || -1;

    //获取所有的新闻信息
    let findRetult = await DB.find("link",{},{},{
        currentPage:currentPage,
        pageSize:pageSize,
        sortJson:{
            [sortJson]:sortRouse
        }
    });
    let allCount = await DB.count("link",{});
    let  totalPages = Math.ceil(allCount/pageSize); //总页数

    // 渲染数据

    let json = {
        linkList:findRetult,
        currentPage:currentPage,
        totalPages:totalPages,
    }
    ctx.body = json;
})



//添加友情链接逻辑
router.post("/add", upload.single("file") ,async (ctx,next)=>{

    let title = ctx.req.body.title.trim();
    let url = ctx.req.body.url;
    let status = ctx.req.body.status;
    let sort = ctx.req.body.sort;
    let pic = ctx.req.file ? ctx.req.file.path.substr(7) : "";

    let add_time = tools.getTime();
    let josn = {
        title,url,status,sort,pic,add_time
    }
    
    let insertResult = await DB.insert("link",josn);
    if(insertResult){
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

});


//更新友情链接逻辑
router.post("/update",upload.single("pic"),async (ctx)=>{
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
    

    let updateResult = await DB.update("link",{"_id":DB.getObjectId(id)},json)
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