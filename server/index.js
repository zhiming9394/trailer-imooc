const Koa = require("koa")
const { connect,initSchemas } = require("./database/init")
const { resolve } = require('path')
const R =require('ramda')
const MIDDLEWARES = ['router']

const useMiddlewares = (app) => {
    R.map(
        R.compose(
            R.forEachObjIndexed(
                initWith => initWith(app)
            ),
            require,
            name => resolve(__dirname,`./middlewares/${name}`)
        )
    )(MIDDLEWARES)
}

;(async () =>{
    await connect()
    initSchemas()

    const app = new Koa()
    await useMiddlewares(app)
    //require("./tasks/movie")
    
    app.listen(2333);
})()