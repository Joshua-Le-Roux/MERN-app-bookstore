//importing mongoose
const mongoose = require('mongoose')

//creating a schema / structure form my user documents
let UserSchema = mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    security:{
        type: String,
        required:true
    },
    userType:{
        type: String,
        required: true
    }
});

//using .model and making it an export so that it can be used to create documents
let User = mongoose.model('User', UserSchema)

module.exports = User