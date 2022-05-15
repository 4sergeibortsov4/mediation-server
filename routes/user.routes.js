const {Router} = require('express')
const router = Router()
const User = require('../models/User')
const auth = require('../middleware/auth.middleware')

// /api/user/ver
router.post('/ver', auth, async (req, res) => {
    try {
        const {fullname, email} = req.body
        if(!fullname || !email){
            return res.status(500).json({message: "Были получены не все данные"})
        }
        let user = await User.findOne({ email: email, fullname: fullname})
        if(!user){
            return res.status(400).json({message: "Пользователь с таким именнем и электронной почтой не существует."})
        }
        user = await User.updateOne({fullname: fullname, email: email}, {isverified: true}, {upsert: false})
        res.json({message: `Пользователь ${fullname} прошёл верификацию.`})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
})


module.exports = router