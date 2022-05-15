const {Schema, model} = require('mongoose')

const news_schema = new Schema({
    date_create: {type: Date, required: true},
    text_news: {type: String, required: true}
})

module.exports = model('News', news_schema)