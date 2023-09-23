const {Router} = require('express');
const {createHmac} = require('crypto');
const {generateToken} = require('../services/auth');
const User = require('../models/user');

const router = Router();

router.get('/login',(req,res)=>{
    return res.render('login');
})

router.get('/signup',(req,res)=>{
    return res.render('signup');
})

router.post('/signup',async (req,res)=>{
    const {fullName,email,password} = req.body;
    const user = await User.findOne({email});
    if(user){
        return res.render('signup',{
            exist : "This Email already exist"
        });
    }
    await User.create({
        fullName,
        email,
        password
    })
    return res.redirect('/login');
})

router.post('/login',async (req,res)=>{
    const {email,password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            throw "err";
        }
        const salt = user.salt;
        const hashPasswordverify = createHmac('sha256',salt).update(password).digest('hex');

        if(hashPasswordverify !== user.password){
            throw "err";
        }

        const token = generateToken(user);
        return res.cookie("token",token).redirect('/');
    }
    catch(err){
        return res.render('login',{
            error : "invalid email or password"
        })
    }
})

router.get('/logout',(req,res)=>{
    return res.clearCookie('token').redirect('/');
})

module.exports = router;