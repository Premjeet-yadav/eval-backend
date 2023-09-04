const express = require('express') ;
const {connect } = require('./configs/db');

const {UserModel} = require('./models/user.model');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const PORT = process.env.PORT || 3000;

const {blog_router} = require('./routes/blog.router');
const {authetication} = require('./middlewares/middleware')
require('dotenv').config();
const  app = express();

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('dummy endpoint');
})

app.post('/signup',async(req,res)=>{
    const {name,email,password} = req.body;
    const isuser = await UserModel.find({email});
    if(isuser){
        res.send('user alresdy exist')
    }else{
    bcrypt.hash(password,2,async function(err,hash){
            const new_user = new UserModel({
                name,
                email,
                password:hash
            });
            await new_user.save();
            res.send('signup successful....')
    });
}
})

//login ...

app.post('/login',async(req,res)=>{
    const {email,password} = req.body;
    const isuser = await UserModel.find({email});
    if(!isuser){
        res.send('signuop first');

    }
    else{
        bcrypt.compare(password,isuser.password,function(err,ans){
            if(ans){
                const token = jwt.sign({user_id:isuser._id},process.env.SECRET_KEY);
                res.send({massage:"login succesful",token:token});
            }else{
                res.send('invalid credentials')
            }
        })
    }
})

app.use("/blogs",authetication,blog_router)
app.listen(PORT,async()=>{
    try{
        await connect;
        console.log('connected successfully.....')
    }catch(err){
        console.log(err);
        console.log("error while connectind")
    }
    console.log('connected att PORT');
})

