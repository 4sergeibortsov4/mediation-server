module.exports = (req, res, next) => {
    if(req.method === 'OPTIONS') {
        return next()
    }

    try {
        let id = req.headers.userId
        req.user = id
        next()
    } catch (error) {
        return res.status(401).json({ message: error.message})
    }
}