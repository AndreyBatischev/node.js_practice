import { Router } from 'express';
import Order from '../models/order.js';
import authMiddleware from '../middleware/auth.js';

const router = Router();

router.get('/', authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({ 'user.userId': req.user._id }).
            populate('user.userId')

        res.render('orders', {
            isOrder: true,
            title: 'Orders',
            orders: orders.map(o => {
                return {
                    ...o._doc,
                    price: o.courses.reduce((total, c) => {
                        return total += c.count * c.course.price
                    }, 0)
                }
            })
        })
    } catch (e) {
        console.log(e);
    }
})

router.post('/', authMiddleware, async (req, res) => {
    try {
        const user = await req.user.populate('cart.items.courseId')

        const courses = user.cart.items.map(i => ({
            count: i.count,
            course: { ...i.courseId._doc }
        }))

        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user
            },
            courses
        })

        await order.save()
        await req.user.clearCart()


        res.redirect('/orders')
    } catch (e) {
        console.log(e);
    }

})

export default router