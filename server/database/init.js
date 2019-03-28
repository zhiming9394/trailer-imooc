const mongoose = require("mongoose")
const db ="mongodb://localhost/doubanMoive"
const glob = require("glob")
const {resolve} = require("path")

mongoose.Promise = global.Promise

exports.initSchemas = () =>{
   glob.sync(resolve(__dirname,"./schema","**/*.js")).forEach(require)
}


exports.connect = () =>{
    let maxConnectiontimes = 0
    
    return new Promise((resolve,reject) =>{

        if(process.env.NODE_ENV !== "production"){
            mongoose.set("debug",true)
        }
    
        mongoose.connect(db,{ useNewUrlParser: true } )
    
        mongoose.connection.on("disconnected",() =>{
            maxConnectiontimes++
             
            if(maxConnectiontimes < 5){
                mongoose.connect(db)
            }else{
                throw new Error("数据库挂了")
            }
        })
    
        mongoose.connection.on("error", err =>{
            
            maxConnectiontimes++
            reject()

            if(maxConnectiontimes < 5){
                mongoose.connect(db)
            }else{
                throw new Error("数据库挂了")
            }
        })
    
        mongoose.connection.once("open",() =>{
            resolve()
             console.log("mongodb connection ok")
        })
    })
}