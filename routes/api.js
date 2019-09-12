let router = require("koa-router")();
let url = require("url");

let ueditor = require("koa2-ueditor")  //引入富文本编辑器

//修改ueditor配置,图片的存放位置及命名
router.all('/editor/controller',ueditor(['public',{
   "imageAllowFiles": [".png", ".jpg", ".jpeg"],
	"imagePathFormat": "/upload/ueditor/image/{yyyy}{mm}{dd}/{filename}"  // 保存为原文件名
}]))


//引入二级路由
let index = require("./api/index");
let login = require("./api/login");
let manage = require("./api/manage");
let user = require("./api/user");
let articlecate = require("./api/articlecate");
let article = require("./api/article");
let focus = require("./api/focus");
let link = require("./api/link");
let nav = require("./api/nav");
let setting = require("./api/setting");





router.use(index);               //公共接口位置
router.use("/login",login);      //登录接口
router.use("/user",user);        //用户界面
router.use("/manage",manage);    //管理员接口
router.use("/articlecate",articlecate); //文章分类接口
router.use("/article",article);     //文章接口
router.use("/focus",focus);      //轮播图接口
router.use("/link",link);        //友情链接接口
router.use("/nav",nav);          //导航接口
router.use("/setting",setting);  //系统设置接口


//导出路由
module.exports = router.routes()