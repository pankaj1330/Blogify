const jwt = require('jsonwebtoken');

function generateToken(user){
    const payload = {
        _id : user._id,
        fullName : user.fullName,
        email : user.email,
        role : user.role
    };

    const token = jwt.sign(payload,process.env.secret);
    return token;
}

function verifyToken(token){
    const user = jwt.verify(token,process.env.secret);
    return user;
}

module.exports = {generateToken,verifyToken};