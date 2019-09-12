let config = require("./config");
let MongoDB = require("mongodb");   //mongo驱动
const ObjectID = MongoDB.ObjectID;

//创建一个客户端
let MongoClient = MongoDB.MongoClient;


class Db {
    // 单例，多次实例化实例不共享的问题
    static getInstance(){
        if(!Db.instance){
            Db.instance = new Db();
        }
        return Db.instance;
    }

    //构造器
    constructor(){
        this.dbClient = ""; //属性 存放db对象
        this.connect();     //实例化的时候连接数据库
    }

    //连接数据库
    connect(){
        let _this = this;
        return new Promise((resolve,reject)=>{
            if(!this.dbClient){ //解决数据库多次连接
                MongoClient.connect(config.dbUrl,(err,client)=>{
                    if(err){
                        reject(err)
                    }else{
                        _this.dbClient = client.db(config.dbName);
                        resolve(_this.dbClient)
                    }
                    
                })
            }else{
                resolve(_this.dbClient)
            }
        })
    }

    //查找
    /**
     * 
     * @param {*} collectionName 数据库名字
     * @param {*} json1   条件
     * @param {*} json2   那些列显示 或不显示
     * @param {*} json3   配置显示的位置  
     */
    find(collectionName,json1,json2,json3){
        if(arguments.length == 2){
            var attr = {};
            var slipNum = 0;
            var pageSize = 0;
        }else if(arguments.length == 3){
            var attr = json1;
            var slipNum = 0;
            var pageSize = 0;
        }else if(arguments.length == 4){
            var attr=json2;
            var page=json3.page ||1;
            var pageSize=json3.pageSize|| 10;
            var slipNum=(page-1)*pageSize;

            if(json3.sortJson){
                var sortJson=json3.sortJson;
            }else{
                var sortJson={}
            }

        }else{
            console.log("传入参数错误");
            
        }

        return new Promise((resolve,reject)=>{
            this.connect().then(db=>{
                let result = db.collection(collectionName).find(json1,{fields:attr}).skip(slipNum).limit(pageSize).sort(sortJson);
                result.toArray(function(err,docs){
                    if(err){
                        reject(err);
                        return;
                    }
                    resolve(docs)
                })
            })
        })
    }

    //更新
    update(collectionName,json1,json2){
        return new Promise((resolve,reject)=>{
            this.connect().then(db=>{
                db.collection(collectionName).updateOne(json1,{
                    $set:json2
                },(err,result)=>{
                    if(err){
                        reject(err)
                    }else{
                        resolve(result)
                    }
                })
            })
        })
    }

    //插入一条数据
    insert(collectionName,json){
        return new  Promise((resolve,reject)=>{
            this.connect().then((db)=>{

                db.collection(collectionName).insertOne(json,function(err,result){
                    if(err){
                        reject(err);
                    }else{

                        resolve(result);
                    }
                })


            })
        })
    }

    //删除一条数据
    remove(collectionName,json){

        return new  Promise((resolve,reject)=>{
            this.connect().then((db)=>{

                db.collection(collectionName).removeOne(json,function(err,result){
                    if(err){
                        reject(err);
                    }else{

                        resolve(result);
                    }
                })


            })
        })
    }

    //处理_id参数
    getObjectId(id){    /*mongodb里面查询 _id 把字符串转换成对象*/

        return new ObjectID(id);
    }

    //统计数量的方法
    count(collectionName,json){

        return new  Promise((resolve,reject)=> {
            this.connect().then((db)=> {

                var result = db.collection(collectionName).count(json);
                result.then(function (count) {

                        resolve(count);
                    }
                )
            })
        })

    }

}

module.exports=Db.getInstance();