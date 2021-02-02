require('dotenv').config()
const JWT = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

function createToken(userInfo) {
    console.log("This is secret: " + process.env.SECRET)
    JWT.sign({ sub: userInfo.id, email: userInfo.email}, process.env.SECRET)
}

function verifyPassword(attemptedPassword, hashedPassword) {
    bcrypt.compareSync(attemptedPassword, hashedPassword)
}

function hashPassword(password) {
    bcrypt.hashSync(password)
}

module.exports = { createToken, verifyPassword, hashPassword }