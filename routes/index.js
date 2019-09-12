const router = require('koa-router')()
let DB = require("../model/db")
let url = require("url")
let tools = require("../model/tools")

//二级路由

router.use(async (ctx,next)=>{

  let pathname = url.parse(ctx.request.url).pathname;
  ctx.state.pathname = pathname;
  let headerList = await DB.find("nav",{})
  let focusList = await DB.find("focus",{})
  ctx.state.headerList = headerList;
  ctx.state.focusList = focusList;
  
  await next();
})

router.get('/', async (ctx) => {
 await ctx.render("home/index.html")
})


router.get('/about', async (ctx) => {
  await ctx.render("home/about.html")
 })
 

 router.get('/case', async (ctx) => {
  await ctx.render("home/case.html")
 })


 router.get('/content/:id', async (ctx) => {
  let id = ctx.params.id;
  let findResult = await DB.find("article",{"_id":DB.getObjectId(id)})
  await ctx.render("home/content.html",{
    content:findResult[0].content
  })
 })


 router.get('/connect', async (ctx) => {
  await ctx.render("home/connect.html")
 })


 router.get('/news', async (ctx) => {
  await ctx.render("home/news.html")
 })

 router.get('/service', async (ctx) => {
  let serviceList = await DB.find("article",{"pid":"5ab34b61c1348e1148e9b8c2"})
   
  await ctx.render("home/service.html",{
    serviceList:serviceList
  })
 })
 

//导出路由
module.exports = router.routes();
