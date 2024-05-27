const SECRET_KEY = "rishabh$@$";
const jwt = require("jsonwebtoken");
async function auth(req,res,next){
    let token = await req.cookies.token;
    if (!token) {
        return res.status(401).send('Access Denied: No Token Provided');
      }
      try {
          jwt.verify(token,SECRET_KEY,(err,user)=>{
          if(err){
            res.send("Error happened!")
          }
          req.user = user;
          next();
        } );
        
      } catch (err) {
        res.status(400).send('Invalid Token');
      }
    };

module.exports={
    auth
}