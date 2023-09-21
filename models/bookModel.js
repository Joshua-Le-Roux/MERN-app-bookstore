//importing mongoose
const mongoose = require('mongoose')

//creating a schema / structure form my book documents
let BookSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true
    },
    synopsis:{
        type: String,
        required:true
    },
    price:{
        type: Number,
        required: true,
        min: 0
    },
    bookType:{
        type: String,
        required: true
    }, 
    genre:{
        type: String,
        required: true
    },
    stock:{
        type: Number,
        required: true,
        min: 0
    },
    imageUrl:{
        type: String,
        required: false,
        default: "images/how-to-draw-a-book-5.jpg"
    }
});

//using .model and making it an export so that it can be used to create documents
let Book = mongoose.model('Book', BookSchema)

module.exports = Book