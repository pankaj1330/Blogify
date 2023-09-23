const {Router} = require('express');
const multer = require('multer');
const Blog = require('../models/blog')
const Comment = require('../models/comment');
const User = require('../models/user');
const fs = require('fs')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads/blogimg/')
    },
    filename: function (req, file, cb) {
      const filename = `${Date.now()}-${file.originalname}`;
      cb(null, filename)
    }
  })
  
  const upload = multer({ storage: storage })


const router = Router();

router.get('/addBlog',(req,res)=>{
    return res.render('addBlog',{
        user : req.user
    });
})

router.get('/view/:id',async (req,res)=>{
    const blogId = req.params.id;
    let blog;
    try{
      blog = await Blog.findOne({_id : blogId});
    }
    catch(err){
      return res.end("<h1>Blog not found</h1>");
    }
    const comments = await Comment.find({writtenTo : blogId}).populate('writtenBy');
    if(req.user){
      if(req.user.email === (await (blog.populate("createdBy"))).createdBy.email){
        return res.render('view',{
          user : req.user,
          blog,
          comments,
          deleteBlog : true
        })
      }
    }
    return res.render('view',{
      user : req.user,
      blog,
      comments,
      deleteBlog : false
    })
})

router.post('/addBlog',upload.single('coverImage'),(req,res)=>{
    const {title,body} = req.body;
    Blog.create({
        title,
        body,
        coverImage  : `/uploads/blogimg/${req.file.filename}`,
        createdBy : req.user._id
    });
    return res.render('addBlog',{
        successfull : "your blog successfully created",
        user : req.user
    });
})

router.post('/comment/:id',async (req,res)=>{
    const blogId = req.params.id;
    const {content} = req.body;
    await Comment.create({
      content,
      writtenBy : req.user._id,
      writtenTo : blogId
    })
    return res.redirect(`/view/${blogId}`)
})

router.get('/yourBlogs',async(req,res)=>{
  const userId = req.user._id;
  const yourBlogs = await Blog.find({createdBy : userId});
  if(!yourBlogs){
    return res.render('yourBlog',{
      user : req.user
    })
  }
  return res.render('yourBlog',{
    user : req.user,
    blogs : yourBlogs
  })
})

router.get('/deleteBlog/:id',async(req,res)=>{
  const blogId = req.params.id;
  const delBlog = await Blog.findById({_id : blogId});
  console.log(delBlog);
  const delBlogImg = delBlog.coverImage;
  await Blog.deleteOne({_id : blogId});


  fs.unlink(delBlogImg, err => {
    if (err) {
      console.log(err);
    }

    console.log('File is deleted.')
  })
  return res.redirect('/yourBlogs');
})
module.exports = router;