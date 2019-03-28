const jwt = require('jsonwebtoken');
var secretOrPrivateKey="zhi ming";// 这是加密的key（密钥）

export const token  =  {
  createToken:function(obj){
      var content =obj.toJSON() ; // 要生成token的主题信息
      var token = jwt.sign(content, secretOrPrivateKey,
          {expiresIn: 60*60*24 });
      return token;
  },
  decodeToken:function(tokenStr){
      let msg ;
      
      jwt.verify(tokenStr, secretOrPrivateKey, function (err, decode) {
              if (err) {  //  时间失效的时候/ 伪造的token
                  return msg = "token is invalid";
               } else {
                  return msg = decode;
              }
      });
      return msg ;
  }

}
