//工具函数
let md_5 = require("md5");   //数据加密

let tools = {
    //对数据进行加密
    md5(value){
        return md_5(value)
    },

    getTime(){
        return new Date();
    },

    //将数据库返回的数据进行格式化
    cateToList(data){
        let dataArr = [];
        data.forEach((item)=>{
            if(item.pid == "0"){
                dataArr.push(item);
            }
        })
        for(let i=0; i<dataArr.length; i++){
            dataArr[i].list = [];
            for(let j=0; j<data.length; j++){
                if(dataArr[i]._id == data[j].pid){
                    dataArr[i].list.push(data[j])
                }
            }
        }
        return dataArr
    }

}

module.exports = tools;