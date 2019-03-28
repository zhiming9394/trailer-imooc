const cp = require("child_process")
const { resolve } = require("path")
const mongoose = require("mongoose")
const Movie = require("../database/schema/movie")
const Category = mongoose.model("Category")

async function savedata(movieDataDetail){

    let movie = await Movie.findOne({
        doubanId:movieDataDetail.doubanId
    })

    if(!movie){
    
        movie = new Movie(movieDataDetail)
    }



    movie.movie_type.forEach(async item => {
   let cat =  await Category.findOne({
       name:item
   })

   if(!cat){
       cat = new Category({
           name:item,
           movies:[movie._id]
       })
   }else{
       if(cat.movies.indexOf(movie._id)=== -1){
           cat.movies.push(movie._id)
       }
   }

   await cat.save()

   if(!movie.category){
       movie.category.push(cat._id)
       await movie.save()
   }else{
       if(movie.category.indexOf(cat._id)=== -1){
           movie.category.push(cat._id)
           await movie.save()
       }
   }
})
}


;(async () =>{
    const script = resolve(__dirname,"../carwler/trailer_list.js")
    const child = cp.fork(script,[])
    let invoked = false

    child.on("error", err => {
        if(invoked) return 
            invoked = true
            console.log(err)
    })

    child.on("exit",code =>{
        if(invoked) return
            invoked = false
            let err = code = 0 ? null :new Error("exit code"+code)

            console.log(err)
    })

    child.on("message",async data =>{
        let movieDataDetail = data.movieDataDetail
        await savedata(movieDataDetail)
    })
})()

