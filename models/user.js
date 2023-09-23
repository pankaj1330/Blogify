const {Schema,model} = require('mongoose');
const {createHmac,randomBytes} = require('crypto');

const Usersch = new Schema({
    fullName : {
        type : String,
        required :true
    },
    email : {
        type:String,
        required:true,
        unique:true
    },
    salt : {
        type : String
    },
    password : {
        type:String,
        required:true
    },
    profileImg : {
        type : String,
        default : '/uploads/profileimg/default.png'
    },
    role : {
        type : String,
        enum : ['USER','ADMIN'],
        default : "USER"
    }
});

Usersch.pre('save',function(next){
    const user = this;
    if(!user.isModified('password')) return;
    const salt = randomBytes(16).toString();
    const hashPassword = createHmac('sha256',salt).update(user.password).digest('hex');

    this.salt = salt;
    this.password = hashPassword;
    return next();
})

const User = model('User',Usersch);

module.exports = User;