require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

const Blog = require('./models/blog')
const userRoutes = require('./routes/userRoute');
const blogRoutes = require('./routes/blogRoute');
const { authenticateUser } = require('./middleware/auth');
const app = express();
const PORT = process.env.PORT;

mongoose.connect(process.env.MONGO_URL)
    .then(()=>{console.log("mongodb connected");})
    .catch(err => console.log(err));

app.use(express.static(path.resolve('./public')));
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(authenticateUser("token"));

app.set('view engine','ejs');
app.set('views',path.resolve('./views'));

app.use('/',userRoutes);
app.use('/',blogRoutes);
app.get('/',async (req,res)=>{
    const blogs = await Blog.find({});
    return res.render('home',{
        user : req.user,
        blogs : blogs,
    });
})

app.get('*',(req,res)=>{
    return res.end("not found");
})


app.listen(PORT,()=>{
    console.log(`listening at port ${PORT}`);
})