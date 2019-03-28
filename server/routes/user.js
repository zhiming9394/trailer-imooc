const { controller ,get ,post,put } =require('../lib/decorator')
const { checkPassword }  =  require('../serve/user')

@controller('/login')
export class userController {
    @post('/')
    async login (ctx,next) {
        const{ email,password} =ctx.request.body
        const matchData = await checkPassword(email,password)

        if(!matchData.user){
            return (ctx.body = {
                success:false,
                error:'账号密码不正确'
            })
        }

        if(!matchData.match){
            return (ctx.body = {
                success:true,
            })
        }

        return (ctx.body = {
            success:false,
            error:'账号密码不正确'
        })
    }
}