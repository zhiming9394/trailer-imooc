const mongoose = require("mongoose")
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId;

const movieSchema = new Schema({
    doubanId:{
        type:String,
        unique:true
    },

    rate:Number,
    title:String,
    summary:String,
    video:String,
    poster:String,
    cover:String,

    movie_type:[String],

    category:[{
        type:ObjectId,
        ref:"Category"
    }],
    
    year:Number,
    comments:[{
        comment:String,
        like:Number
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

movieSchema.pre("save", function (next){
    if(this.isNew){
        this.meta.createdAt = this.meta.updatedAt = Date.now()
    }else{
        this.meta.updateAt = Date.now()
    }

    next();
})


module.exports = mongoose.model("Movie",movieSchema)