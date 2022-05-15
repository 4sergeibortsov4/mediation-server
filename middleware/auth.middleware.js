const jsonwebtoken = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
    if(req.method === 'OPTIONS') {
        return next()
    }

    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jsonwebtoken.verify(token, config.get('jwtsecret'))
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({ message: error.message})
    }
}