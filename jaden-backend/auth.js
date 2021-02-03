require('dotenv').config()
const JWT = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

function createToken(userInfo) {
    return JWT.sign({ sub: userInfo.id, email: userInfo.email}, process.env.SECRET)
}

function verifyPassword(attemptedPassword, hashedPassword) {
    return bcrypt.compareSync(attemptedPassword, hashedPassword)
}

function hashPassword(password) {
    return bcrypt.hashSync(password)
}

module.exports = { createToken, verifyPassword, hashPassword }