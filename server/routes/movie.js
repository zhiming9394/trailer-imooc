
const { controller ,get ,post,put } =require('../lib/decorator')
const { getAllMovies }  =  require('../serve/movie')

@controller('/movies')
export class movieController {
    @get('/')
    async getMovies (ctx,next) {
        const{type} =ctx.query
        const moives = await getAllMovies(type)

        ctx.body = {
            moives
        }
    }
}