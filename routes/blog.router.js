const {Router} = require('express');

const {BlogModel} = require('../models/blog.model');

const {UserModel} = require('../models/user.model');

const blog_router = Router();

// get blog .....

blog_router.get('/',async(req,res)=>{
    const result = await BlogModel.find();
    res.status(201).json(result);
})

//craete blog ...

blog_router.post ('/create',async(req,res)=>{
    const {title,category,content} = req.body;

    const creator_id = req.user_id;
    console.log(creator_id);
    const user = await UserModel.findOne({_id:creator_id});
    const new_blog = new BlogModel({
        title,
        category,
        content,
        author:user.name,
    });
    await new_blog.save();
    res.send('blog created successfully.......')
});

// update blogs...
blog_router.put('/edit/:blogId', async(req,res)=>{
    const blog_id = req.params.blogId;
    const payload = req.body;
    const user_id = req.user_id;
    const isuser = await UserModel.findOne({_id:user_id});
    const email = isuser.email;
    const blog = await BlogModel.findOne({_id:blog_id});

    const blog_creator = isuser.email;
    if(blog_creator!==email){
        res.send('you are not authorsised')
    }else{
        await BlogModel.findOneAndUpdate(blog_id,payload);
        res.send('updated sucsessfully........');
    }
})

blog_router.delete('/delete/:blogId', async(req,res)=>{
    const blog_id = req.params.blogId;
    
    const user_id = req.user_id;
    const isuser = await UserModel.findOne({_id:user_id});
    const email = isuser.email;
    const blog = await BlogModel.findOne({_id:blog_id});

    const blog_creator = isuser.email;
    if(blog_creator!==email){
        res.send('you are not authorsised')
    }else{
        await BlogModel.findOneAndDelete(blog_id);
        res.send('deleted sucsessfully........');
    }
})

module.exports = {blog_router};