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

//渲染编辑文章表单
router.get("/",async (ctx)=>{
    
    let findResult = await DB.find("setting",{})
    
    await ctx.render("admin/setting/index",{
        list: findResult[0],
    })
})


//编辑文章逻辑
router.post("/doEdit",upload.single("site_logo"),async (ctx)=>{
    let id = ctx.req.body.id;
    let site_title = ctx.req.body.site_title.trim();
    let site_icp = ctx.req.body.site_icp.trim();
    let site_status = ctx.req.body.site_status;
    let site_qq = ctx.req.body.site_qq;
    let site_tel = ctx.req.body.site_tel;
    let site_address = ctx.req.body.site_address;
    let site_keywords = ctx.req.body.site_keywords;
    let site_description = ctx.req.body.site_description || "";
    let site_logo = ctx.req.file ? ctx.req.file.path.substr(7) : "";
    let json = {};
    if(site_logo){
        json = {
            site_title,site_icp,site_status,site_qq,site_tel,site_address,site_keywords,site_description,site_logo
        }
    }else{
        json = {
            site_title,site_icp,site_status,site_qq,site_tel,site_address,site_keywords,site_description
        }
    }
    
    await DB.update("setting",{"_id":DB.getObjectId(id)},json)

    ctx.redirect("/admin/setting")
})



//导出路由
module.exports = router.routes();