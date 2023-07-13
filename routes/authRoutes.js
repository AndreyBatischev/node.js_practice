import { Router } from 'express';
const router = Router();
import User from '.././models/user.js'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import contentMail from '../emails/registration.js';
import resetPassword from '../emails/reset.js';
import { validationResult } from 'express-validator';
import * as formValidators from '../utils/validators.js';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'a.e.batischev@gmail.com',
        pass: 'nooqxzndclfbtwgn',
    }
})

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Login',
        isLogin: true,
        loginError: req.flash('loginError'),
        registerError: req.flash('registerError')
    })
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login')
    })
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        const candidate = await User.findOne({ email })

        if (candidate) {
            const areSame = await bcrypt.compare(password, candidate.password)

            if (areSame) {
                req.session.user = candidate
                req.session.isAuthenticated = true
                req.session.save(err => {
                    if (err) {
                        throw err
                    }
                    res.redirect('/')
                })
            } else {
                req.flash("loginError", 'Email or password is incorrect')
                res.redirect('/auth/login#login')
            }
        } else {
            req.flash("loginError", 'User not exists')
            res.redirect('/auth/login#login')
        }

    } catch (error) {
        console.log(error);
    }

})

router.post('/register', formValidators.registerValidators, async (req, res) => {
    try {
        const { email, password, name } = req.body

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            req.flash('registerError', errors.array()[0].msg)
            return res.status(422).redirect('/auth/login#register')
        }

        const hashPassword = await bcrypt.hash(password, 10)
        const user = new User({ email, name, password: hashPassword, cart: { items: [] } })
        await user.save()
        await transporter.sendMail(contentMail(email))
        res.redirect('/auth/login#login')

    } catch (error) {
        console.log(error);
    }
})

router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: 'Fogot password?',
        error: req.flash('error')
    })
})

router.get('/password/:token', async (req, res) => {
    if (!req.params.token) {
        return res.redirect('/auth/login')
    }
    try {
        const user = await User.findOne({
            resetToken: req.params.token,
            resetTokenExp: { $gt: Date.now() }
        })

        if (!user) {
            return res.redirect('/auth/login')
        } else {
            res.render('auth/password', {
                title: 'Recover password',
                error: req.flash('error'),
                userId: user._id.toString(),
                token: req.params.token
            })
        }

    } catch (error) {
        console.log(error);
    }



})

router.post('/reset', (req, res) => {
    try {
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                req.flash('error', 'Something  went wrong, try latter')
                res.redirect('/auth/reset')
            }

            const token = buffer.toString('hex')
            const candidate = await User.findOne({ email: req.body.email })

            if (candidate) {
                candidate.resetToken = token
                candidate.resetTokenExp = Date.now() + 60 * 60 * 1000
                await candidate.save()
                await transporter.sendMail(resetPassword(candidate.email, token))
                res.redirect('/auth/login')
            } else {
                req.flash('error', `User witch email - ${req.body.email} not found`)
                res.redirect('/auth/reset')
            }
        })
    } catch (error) {
        console.log(error);
    }
})

router.post('/password', async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.body.userId,
            resetToken: req.body.token,
            resetTokenExp: { $gt: Date.now() }
        })

        if (user) {
            user.password = await bcrypt.hash(req.body.password, 10)
            user.resetToken = undefined
            user.resetTokenExp = undefined
            await user.save()
            res.redirect('/auth/login')
        } else {
            req.flash('loginError', 'Token has expired')
            res.redirect('/auth/login')
        }

    } catch (error) {
        console.log(error);
    }
})

export default router