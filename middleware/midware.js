const key = process.env.SECRETKEY
let jwt = require('jsonwebtoken')

//this function checks if there is a token, and then if that token is valid
function checkJWT (req, res, next) {
    if (req.headers.token) {
        let token = req.headers.token
        jwt.verify(token, key, function (error, data) {
            if (error) {
                //if token is invalid it sends this response
                res.send({message : "Invalid token" })
                //next() is called which moves the request on to the next middleware/function
                next()
            } else {
                //if it is valid it takes the data passed in the token and passes it to be used in the next middleware/function
                req.username = data.username
                req.password = data.password
                req.userType = data.userType
                next()
            }
        })
    } else {
        //if no token is found, err is sent
        res.send({message: "Token not found"})
        next()
    }
}

function checkUser (req, res, next) {
    const access = req.userType
    // only allows admin to perform the functions where this middleware is placed
    if (access == "admin") {
        next()
    } else {
        res.send({message: "only admins can perform this function"})
        next()
    }
}

module.exports = {
    checkJWT, checkUser
}