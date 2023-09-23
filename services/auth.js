const jwt = require('jsonwebtoken');
const secret = "@1284do//DJNA~*4="

function generateToken(user){
    const payload = {
        _id : user._id,
        fullName : user.fullName,
        email : user.email,
        role : user.role
    };

    const token = jwt.sign(payload,secret);
    return token;
}

function verifyToken(token){
    const user = jwt.verify(token,secret);
    return user;
}

module.exports = {generateToken,verifyToken};