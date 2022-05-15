const {Router} = require('express')
const router = Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const config = require('config')
const crypto = require('crypto')

// /api/auth/register
router.post('/register',
[check('email', 'Некорректный Email').isEmail(), 
check('password', 'Минимальная длина пароля 8 символов ').isLength({min: 8})],
async (req, res) => {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array(), message: 'Некорректные данные при регистрации'})
        }
        const {email, fullname, password} = req.body
        const candidate = await User.findOne({ email: email, fullname: fullname})
        if(candidate){
            return res.status(400).json({message: "Пользователь с таким именнем и электронной почтой уже существует"})
        }
        const HashedPassword = await bcrypt.hash(password, 12)
        const user = new User({ email, fullname, password: HashedPassword})
        await user.save()
        res.status(201).json({message: "Пользователь создан."})
    } catch (error) {   
        return res.status(500).json({message: error.message})
    }
})

// /api/auth/login
router.post('/login',[check('email', 'Введите корректный email').normalizeEmail().isEmail(), check('password', 'Введите пароль').exists()] ,async (req, res) => {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array(), message: 'Некорректные данные при входе в систему.'})
        }
        const {email, password} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: 'Что-то пошло не так. Скорее всего такого пользователя не существует.'})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({message: 'Неверный пароль. Попробуйте снова.'})
        }
        const token = jsonwebtoken.sign({  userId: user.id }, config.get('jwtsecret'), {expiresIn: '1h'})
        //var decipher = crypto.createDecipher("aes256", config.get('key'))
        //var decrypted_fullname = await decipher.update(user.fullname, 'hex', 'utf8') + decipher.final('utf8')
        res.json({token, userId: user.id, isWorker: user.isWorker, isverified: user.isverified, email: user.email, fullname: user.fullname})
    } catch (error) {   
        return res.status(500).json({message: error.message})
    }
})

// /api/auth/get
router.post('/get', async (req, res) => {
    try {
        const userId = req.body.userId
        const user = await User.findOne({_id: userId})
        if(!user){
            return res.status(500).json({message: "Не найден пользователь."})
        }
        var decipher = crypto.createDecipher("aes256", config.get('key'))
        var decrypted_fullname = await decipher.update(user.fullname, 'hex', 'utf8') + decipher.final('utf8')
        res.json({email: user.email, decrypted_fullname})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
})

module.exports = router