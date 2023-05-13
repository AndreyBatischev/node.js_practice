import { Router } from 'express';
import Course from '../models/course.js';
import Card from '../models/card.js';
const router = Router();

router.post('/add', async (req, res) => {
    const course = await Course.genOne(req.body.id)
    await Card.add(course)
    res.redirect('/card')
})

router.delete('/remove/:id', async (req, res) => {
    const card = await Card.remove(req.params.id)
    res.status(200).json(card)
})

router.get('/', async (req, res) => {
    const card = await Card.fetch()

    res.render('card', {
        title: 'Bascket',
        isCard: true,
        courses: card.courses,
        price: card.price

    })
})

export default router