const {Schema, model} = require('mongoose')

const user_schema = new Schema({
    fullname: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: false},
    isverified: {type: Boolean, default: false, required: true, unique: false},
    isWorker: {type: Boolean, default: false, required: true, unique: false}
})

module.exports = model('User', user_schema) 