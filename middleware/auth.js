const {verifyToken} = require('../services/auth')

function authenticateUser(cookieName){
    return (req,res,next) => {
        const token = req.cookies[cookieName];
        if(!token){
            return next();
        }
        try{
            const userPayload = verifyToken(token);
            req.user = userPayload;
        }
        catch(err){}
        
        return next();
    }
}

module.exports = {authenticateUser};