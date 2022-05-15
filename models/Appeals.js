const {Schema, model, Types} = require('mongoose')

const appeal_schema = new Schema({
    date_create: {type: Date, required: true, unique: false},
    Text_appeal: {type: String, required: true, unique: false },
    id_user: {type: String, required: true, unique: false},
    answer_worker: {type: String, required: false, unique: false},
    answer_date: {type: Date, required: false, unique: false}
})

module.exports = model('Appeal', appeal_schema)