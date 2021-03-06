const router = require("koa-router")()
const DB = require("../../model/db");


// 创建二级路由
router.get("/",async (ctx)=>{
    await ctx.render("admin/index")
})

//改变状态
router.get("/changeStatus",async (ctx)=>{
   let collectionName = ctx.query.collectionName;
   let attr = ctx.query.attr;
   let id = ctx.query.id;
   
   let findResult = await DB.find(collectionName,{"_id":DB.getObjectId(id)})
   let json = {};
   if(findResult.length>0){
        
       if(findResult[0][attr] == 1){
            json = {
               status : 0
           }
       }else{
             json = {
                status : 1
            }
       }
       let updateResult = await DB.update(collectionName,{"_id":DB.getObjectId(id)},json)
       if(updateResult){
            ctx.body = {message:"更新成功",success:true}
       }else{
            ctx.body = {message:"更新失败",success:false}
       } 
   }else{
    ctx.body = {message:"更新失败,参数错误",success:false}
   }
})

//改变排序状态
router.get("/changeSort",async (ctx)=>{
    let collectionName = ctx.query.collectionName;
    let sortValue = ctx.query.sortValue;
    let id = ctx.query.id;
    let json = {
        sort:sortValue
    }

    let updateResult = await DB.update(collectionName,{"_id":DB.getObjectId(id)},json)
    if(updateResult){
        //  ctx.body = {message:"更新成功",success:true,currentUrl:ctx.state.AdminInfo.referer}
         ctx.body = {message:"更新成功",success:true}
    }else{
         ctx.body = {message:"更新失败",success:false}
    } 
 })

//删除数据库中的数据
router.get("/delete",async (ctx)=>{
    let collectionName = ctx.query.collectionName;
    let id = ctx.query.id;
    // let current = await DB.find(collectionName,{"_id":DB.getObjectId(id)});
    // let findResult = await DB.find(collectionName,{"_id":current[0].pid});
    
    await DB.remove(collectionName,{"_id":DB.getObjectId(id)});
    ctx.redirect(ctx.state.AdminInfo.referer);
 })


//导出路由
module.exports = router.routes()