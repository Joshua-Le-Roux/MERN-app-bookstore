const User = require('../models/userModel')
let jwt = require('jsonwebtoken')

//signup function which will be used to add users to db
exports.addUser = async (req, res) => {
    //takes in the users info via body of request
    const newUsername = req.body.username
    const newPass = req.body.password
    const newSec = req.body.security
    let newType

    //sets the userType by what their password ends in
    if (newPass.endsWith('_adminspass')) {
        newType = 'admin'
    } else {
        newType = 'customer'
    }

    //searching for the user on the db incase these details have already been entered
    const usrInfo = await User.find({
        $and: [
            {username: newUsername},
            {password: newPass}
        ]
    })


    if (usrInfo.length > 0){
        res.send({message: 'User already registered'})
    } 
    else {
        try {
            const newUser = new User({
                username: newUsername,
                password: newPass,
                security: newSec,
                userType: newType
            })
            // using .save() on the newly created document
            const addedUser = await newUser.save()
            // returning the document
            res.json(addedUser)
        }
        catch (error){
            console.log(error)
            res.send('User could not be added')
        }
    }
}

//login function which takes in previously created email and password/recovery answer
exports.login = async (req, res) => {
    const usrnme = req.body.username
    const pswd = req.body.password
    const sec = req.body.security

    //seraching for user with email and pass
    let usrInfo = await User.find({
        $and: [
            {username: usrnme},
            {password: pswd}
        ]
    })

    //searching for userwith email and recovery
    const recover = await User.find({
        $and: [
            {username: usrnme},
            {security: sec}
        ]
    })

    //if username and recovery question is passed through, the usrInfo will be reassigned to the recover info
    if (usrInfo.length == 0 && recover.length > 0) {
        usrInfo = recover
    }
    
    //checking the users info and then using it to create token, then sending it
    if (usrnme == usrInfo[0].username && pswd == usrInfo[0].password || usrnme == usrInfo[0].username && sec == usrInfo[0].security) {
        payload = {
            username: usrInfo[0].username,
            password: usrInfo[0].password,
            userType: usrInfo[0].userType
        }
        const token = jwt.sign(JSON.stringify(payload), 'jwt-passkey', { algorithm: "HS256"})
        res.send({'token': token})
    } 
    else {
        res.send({message: 'Make sure you have signed up, or check entered details'})
    }
}

//function for returning the type of customer that has signed in
exports.userType = (req, res) => {
    const typeOfUser = req.userType

    if (typeOfUser == 'admin') {
        res.send({type: "admin"})
    } 
    else if (typeOfUser == 'customer') {
        res.send({type: 'customer'})
    } 
    else {
        res.send({message: "Could not get user type"})
    }

}