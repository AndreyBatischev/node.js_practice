import { body } from 'express-validator';
import User from '.././models/user.js'

const registerValidators = [
    body('name')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 chapter')
        .trim(),
    body('email')
        .isEmail().withMessage('Enter valid email')
        .custom(async (value, { req }) => {
            try {
                const user = await User.findOne({ email: value })
                if (user) {
                    return Promise.reject('This email already exist ')
                }
            } catch (error) {
                console.log(error);
            }
        })
        .normalizeEmail(),
    body('password', 'Password must be at least 6 chapter')
        .isLength({ min: 6, max: 25 })
        .isAlphanumeric()
        .trim(),
    body('confirm')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Confirm password must be match with password')
            }
            return true
        }).trim(),

]

const coursValidators = [
    body('title').isLength({ min: 3 }).withMessage('Title must be at least 3 chapter').trim(),
    body('price').isNumeric().withMessage('Enter correct price'),
    body('img', 'Enter correct URL').isURL()

]

export { registerValidators, coursValidators }