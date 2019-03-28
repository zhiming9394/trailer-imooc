const mongoose = require("mongoose")
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId;

const categorySchema = new Schema({
    name:{
        unique:true,
        type:String
    },
    movies:[{
        type:ObjectId,
        ref:"Moive"
    }],

    meta:{
        createdAt:{
            type:Date,
            default:Date.now()
        },
        updatedAt:{
            type:Date,
            default:Date.now()
        }
    }
})

categorySchema.pre("save", function (next){
    if(this.isNew){
        this.meta.createdAt = this.meta.updatedAt = Date.now()
    }else{
        this.meta.updateAt = Date.now()
    }

    next();
})


module.exports = mongoose.model("Category",categorySchema)