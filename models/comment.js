const {Schema,model} = require('mongoose')

const commentSch = new Schema({
    content : {
        type : String,
        required : true,
    },
    writtenBy : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    writtenTo : {
        type : Schema.Types.ObjectId,
        ref : "Blog"
    }
},
{timestamps:true})

const Comment = model('Comment',commentSch);

module.exports = Comment;
