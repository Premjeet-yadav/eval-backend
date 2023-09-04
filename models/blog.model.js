const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    title : {type:String,required:true},
    category : {type:String,required:true},
    author : {type:String,required:true},
    Content : {type:String,required:true}
});

const BlogModel = mongoose.model('blog' ,BlogSchema);

module.exports = {BlogModel};