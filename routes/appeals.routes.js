const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth.middleware')
const Appeals = require('../models/Appeals')
const moment = require('moment')
const User = require('../models/User')
const config = require('config')
const crypto = require('crypto')
var url = require("url")

// /api/appeals/all
router.post('/all', auth, async (req, res) => {
    try {
        const userId = req.body.userId
        const appeals = await Appeals.find({ id_user: userId })
        res.json(appeals)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
})


// /api/appeals/allw
router.post('/allw', auth, async (req, res) => {
    try {
        const id = req.body.userId
        const user = await User.findOne({_id: id})
        if(!user){
            return res.status(500).json({message: "Нет такого пользователя."})
        }
        const appeals = await Appeals.find()
        if(!appeals){
            return res.status(500).json({message: "Не найдено обращений."})
        }
        res.json(appeals)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
})

// /api/appeals/create
router.post('/create', async (req, res) => {
    try{
        const id = req.body.userId
        if(!id){
            return res.status(500).json({message: "Нет Id"})
        }
        const Text_appeal = req.body.Text_appeal
        if(!Text_appeal){
            return res.status(500).json({message: "Нет текста"})
        }
        const user = await User.findOne({ _id: id })
        if(!user){
            return res.status(500).json({message: error.message})
        }
        var today = await moment(new Date()).format('YYYY-MM-DD[T00:00:00.000Z]')
        var cipher = await crypto.createCipher("aes256", config.get('key'))
        var CryptoText_appeal = await cipher.update(Text_appeal, 'utf8', 'hex') + cipher.final('hex')
        const appeal = new Appeals({date_create: today, Text_appeal: Text_appeal, id_user: id, id_worker: ' ', answer_worker: ' '})
        await appeal.save()
        res.status(201).json({message: "Обращение создано. Ожидайте ответа."})
    }
    catch (error){
        return res.status(500).json({message: error.message})
    }
})

// /api/appeals/:id
router.post('/answer', auth, async (req, res) => {
    try {
        const id = { _id: req.headers.referer.split('/')[4]}    
        const answer = req.body.answer_worker
        var today = await moment(new Date()).format('YYYY-MM-DD[T00:00:00.000Z]')
        let appeals = await Appeals.find({_id: id})
        if(!appeals){
            return res.status(500).json({message: "Не существует такого обращения."})
        }
        appeals = await Appeals.updateOne(id, {answer_worker: answer, answer_date: today}, {upsert: false})
        if(!appeals){
            return res.status(500).json({message: "Нет обращений[3]"})
        }
        res.json({message: "Ответ отправлен."})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
})


module.exports = router