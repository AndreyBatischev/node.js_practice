import { Router } from 'express';
const router = Router();

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Login',
        isLogin: true
    })
})

export default router