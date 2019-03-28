const mongoose = require('mongoose')
const User = mongoose.model('user')

export const checkPassword = async (name,Password) =>{
    let match = false

    const user = await User.findOne({name})

    if(user){
        match = await user.comparePassword(password,user.password)
    }

    return {
        match,
        user
    }
}