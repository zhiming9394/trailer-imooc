const mongoose = require("mongoose")
const bcrpyt =require("bcryptjs")
const Schema = mongoose.Schema
const SALT_WORK_FACTOR = 10
const MAX_LOGIN_ATTEMPTS = 5
const LOCK_TIME = 2*60*60*1000

const UserSchema = new Schema({
    username:{
        unique:true,
        type:String,
    },
    password:{
        type:String,
    },

    loginAttemps:{
        type:Number,
        required:true,
        default:true,
    },
    
    lockUnitl:Number,
    
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

UserSchema.pre("save",function (next){
    if(this.isNew){
        this.meta.createdAt = this.meta.updatedAt = Date.now()
    }else{
        this.meta.updateAt = Date.now()
    }

    next();
})

UserSchema.virtual("isLocked").get(function () {
    return (this.lockUnitl && this.lockUnitl > Date.now())
})

UserSchema.pre("save", next =>{
    if(!this.isModified("password")) return next()

    bcrpyt.genSalt(SALT_WORK_FACTOR,(err,salt) =>{
        if(err) return next(err)
    
        bcrpyt.hash(this.password,salt,(error,hash) =>{
            if(error) return next( )

            this.password = hash
        })
    })

UserSchema.methods ={
    comparePassword:(_password,password) =>{
        return new Promise((resolve,reject) =>{
            bcrypt.campare(_password,password,(err,isMatch) =>{
                if(!err) resolve(isMatch)
                else reject(err)
            })
        })
    },

    incLoginAttepts:(user) =>{
        return new Promise((resolve,reject)=>{
            if(this.lockUnitl && this.lockUnitl < Date.now()){
                this.update({
                    $set:{
                        loginAttempts:1
                    },
                    $unset:{
                        lockUnitl:1
                    }
                },(err) =>{
                    if(!err) resolve(true)
                    else reject(err)
                })
            }else{
                let updates = {
                    $inc:{
                        loginAttemps : 1
                    }
                }
    
                if(this.loginAttempts+ 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked){
                    update.$set ={
                        lockUnitl:Date.now() + LOCK_TIME
                    }
                }
    
                this.update(updates,err =>{
                    if(!err) resolve(true)
                    else reject(err)
                })
            }
        })
    }
}
})


mongoose.model("User",UserSchema)