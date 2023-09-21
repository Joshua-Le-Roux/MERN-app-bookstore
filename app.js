//importing all required modules
require('dotenv').config() 
const clusterPass = process.env.CLUSTER
const express = require('express')
const app = express()
let mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
//importing the functions created in the controller.js
const userController = require('./controllers/userController')
const bookController = require('./controllers/bookController')
//imported middleware
let {checkJWT, checkUser} = require('./middleware/midware')

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

//the connection string needed to access the mongoDB atlas cluster 
const uri = `mongodb+srv://joshualerouxjlr:${clusterPass}@firstcluster.z5pz7gw.mongodb.net/?retryWrites=true&w=majority`
mongoose.Promise = global.Promise

//using .connect to establish a connection between the back end and the cluster and database
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on('error', function() {
    console.log('Failed to connect to db, exiting')
    process.exit();
})

mongoose.connection.once('open', function() {
    console.log('Connected to db')
})

//assigning the pathways for the different CRUD functions created in userController.js and bookController.js
//adds a user
app.post('/signup', userController.addUser)

//logs a user in and generates token
app.post('/login',  userController.login)

//checks the type of user and returns it
app.get('/user-type', checkJWT, userController.userType)

//for adding a book
app.post('/add-book', checkJWT, checkUser, bookController.addBook)

//for editing a book
app.put('/edit-book/:id', checkJWT, checkUser, bookController.editBook)

//for deleting a book
app.delete('/book/:id', checkJWT, checkUser, bookController.removeBook)

//for deleting a user
app.delete('/user/:id', checkJWT, checkUser, bookController.removeUser)

//for accessing users
app.get('/find-users', checkJWT, checkUser, bookController.findUsers)

//for viewing profile info
app.get('/users-info', checkJWT, bookController.viewInfo)

//for viewing books
app.get('/books', bookController.viewBooks)

//for finding a book by its id
app.get('/find-book/:id', bookController.showBook)

//running the app on port 8000
app.listen(8000, function () {
    console.log('Running on port 8000')
})