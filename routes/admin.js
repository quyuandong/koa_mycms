let router = require("koa-router")();
let url = require("url");

let ueditor = require("koa2-ueditor")  //引入富文本编辑器

//修改ueditor配置,图片的存放位置及命名
router.all('/editor/controller',ueditor(['public',{
   "imageAllowFiles": [".png", ".jpg", ".jpeg"],
	"imagePathFormat": "/upload/ueditor/image/{yyyy}{mm}{dd}/{filename}"  // 保存为原文件名
}]))


//引入二级路由
let login = require("./admin/login");
let user = require("./admin/user");
let manage = require("./admin/manage");
let index = require("./admin/index");
let articlecate = require("./admin/articlecate");
let article = require("./admin/article");
let focus = require("./admin/focus");
let link = require("./admin/link");
let nav = require("./admin/nav");
let setting = require("./admin/setting");


//得到资源的绝地路径
router.use( async (ctx,next)=>{
   //配置全局变量
   ctx.state.__HOST__ = "http://"+ctx.request.header.host;

    //获取到请求的路径
    let pathname = url.parse(ctx.request.url).pathname.substring(1);
    let splitUrl = pathname.split("/")
    

   //保存用户信息到state上
   ctx.state.AdminInfo = {
      url:splitUrl,
      userinfo: ctx.session.userinfo,
      referer:ctx.request.header['referer'],
   }

  
   //权限校验
   if(ctx.session.userinfo){
      if("admin/login"==pathname){
         ctx.redirect("/admin/")   
      }
      await next();
   }else{
      if("admin/login"==pathname || "admin/login/doLogin"== pathname || "admin/login/code"== pathname ){
         await next();
      }else{
         ctx.redirect("/admin/login")
      }
   }

})





router.use(index);            //管理员主界面
router.use("/login",login);   //登录界面
router.use("/user",user);     //用户界面
router.use("/manage",manage); //管理员界面
router.use("/articlecate",articlecate); //文章分类页面
router.use("/article",article);  //文章页面
router.use("/focus",focus);      //轮播图页面
router.use("/link",link);        //友情链接
router.use("/nav",nav);          //导航
router.use("/setting",setting);  //设置页面


//导出路由
module.exports = router.routes()