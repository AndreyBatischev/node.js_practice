import User from '../models/user.js'

async function userMiddleware(req, res, next) {
    if (!req.session.user) {
        return next()
    }

    req.user = await User.findById(req.session.user._id)
    next()
}

export default userMiddleware