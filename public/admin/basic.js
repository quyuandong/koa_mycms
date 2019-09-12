

let basic = {

    
    //改变状态
    change:function(el,collectionName,attr,id){

        $.get("/admin/changeStatus",{collectionName:collectionName,attr:attr,id:id},function(data){
            if(data.success){
                
                if(el.src.indexOf("yes")!=-1){
                    el.src = "/admin/images/no.gif"
                }else{
                    el.src = "/admin/images/yes.gif"
                }
            }else{
                window.confirm("操作失败！！");
            }
        })
    },

    //改变排序
    changeSort(el,collectionName,id){
        
        let sortValue = el.value;
        $.get("/admin/changeSort",{collectionName:collectionName,sortValue:sortValue,id:id},function(data){
            if(data.success){
                console.log("修改成功！");
            }else{
                window.confirm("操作失败！！");
            }
        })
    },


}