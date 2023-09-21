const Book = require('../models/bookModel')
const User = require('../models/userModel')

//for admin to add a book
exports.addBook = async (req, res) => {
    const newTitle = req.body.title
    const newAuth = req.body.author
    const newSynop = req.body.synopsis
    const newPrice = req.body.price
    const newType = req.body.bookType
    const newGenre = req.body.genre
    const newStock = req.body.stock
    let newImg = req.body.imageUrl

    //setting the img url if none was entered
    if (newImg == "") {
        newImg = "/static/images/how-to-draw-a-book-5.jpg"
    }

    try {
        const newBook = new Book({
            title: newTitle,
            author: newAuth,
            synopsis: newSynop,
            price: newPrice,
            bookType: newType,
            genre: newGenre,
            stock: newStock,
            imageUrl: newImg
        })
        // using .save() on the newly created document
        const addedItem = await newBook.save()
        // returning the document
        res.json(addedItem)
    }
    catch (error){
        console.log(error)
        res.send('Book could not be added')
    }
}

//for admin to edit a books info
exports.editBook = async (req, res) => {
    const id = req.params.id
    const prop = req.body.property
    const val = req.body.value

    //if editing a price or stock property, the value must be a number
    if (prop == "price" || prop == "stock") {
        Number(val)
    }

    //searches the db with the book id and then updates that document
    try {
        const newUpdate = await Book.findByIdAndUpdate( {_id: id } , {
           $set: {[prop]: val}
        },
        {new: true}
      )

      res.json(newUpdate)
    } 
    catch (error) {
        console.log(error)
        res.send({message: 'Book could not be updated'})
    }
}

//for removing a book from display/db
exports.removeBook = async (req, res) => {
    const id = req.params.id

    //uses id to delete a book from the database
    try {
        await Book.deleteOne({_id: id})
        res.send({message :'Book deleted'})
    } catch (error) {
        console.log(error)
        res.send({message: 'Book failed to delete', error})
    }
}

//admin access user info
exports.findUsers = async (req, res) => {
    //get request so admins can see the users docs
    try {
        const users = await User.find()
        res.json(users)
    } catch (err) {
        res.send({message: err})
    }
}

//admins to remove user
exports.removeUser = async (req, res) => {
    const id = req.params.id
    //admins use a users id to remove them from the db
    try {
        await User.deleteOne({_id: id})
        res.send({message :'User removed'})
    } catch (error) {
        console.log(error)
        res.send({message: 'User failed to remove', error})
    }
}

//normal and admin to view profile info 
//needs middleware which extracts users username and password from the token
exports.viewInfo = async (req,res) => {
    //get the username and password from the token check middleware
    const usrname = req.username
    const pswd = req.password
    
    //searches for that in the db
    const info = await User.find({
        $and: [
            {username: usrname},
            {password: pswd}
        ]
    })

    //send back the email and password for user to see
    if (info.length == 0) {
        res.send({message: "Info not able to be retrieved, error with token likely"})
    } else {
        res.send([{username: usrname, password: pswd}])
    }
}

// operations for normal user
//get to view books
exports.viewBooks = async (req, res) => {
    try {
        const books = await Book.find()
        res.json(books)
    } catch (err) {
        res.send({message: err})
    }
}

//get request to view a certain book
// uses the id to locate and pass on 
exports.showBook = async (req, res) => {
    let id = req.params.id

    try {
        const books = await Book.findById(id)
        res.json(books)
    } catch (err) {
        res.send({message: err})
    }
}
