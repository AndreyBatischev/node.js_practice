import { Router } from 'express';
import Course from '../models/course.js';
import authMiddleware from '../middleware/auth.js';
const router = Router();

router.get('/', (req, res) => {
    res.render('index', {
        title: 'Home page',
        isHome: true
    })
})

router.get('/add', authMiddleware, (req, res) => {
    res.render('addCourse', {
        title: 'Add new course',
        isAdd: true
    })
})

router.post('/add', authMiddleware, async (req, res) => {
    const { title, price, img } = req.body
    const cousre = new Course({ title, price, img, userId: req.user._id })

    try {
        await cousre.save()
        res.redirect('/courses')
    } catch (error) {
        console.log(error);
    }

})

router.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find({})
            .populate('userId', 'email name')
            .select('price title img')

        res.render('courses', {
            title: 'Courses',
            isCourses: true,
            userId: req.user ? req.user._id : null,
            courses
        })
    } catch (error) {
        console.log(error);
    }

})

function isOwner(course, req) {
    return course.userId.toString() !== req.user._id.toString()
}

router.get('/courses/:id/edit', authMiddleware, async (req, res) => {
    if (!req.query.allow) {
        return redirect('/')
    }

    try {
        const course = await Course.findById(req.params.id)

        if (isOwner(course, req)) {
            return res.redirect('/courses')
        }

        res.render('course-edit', {
            title: `Edit ${course.title}`,
            course
        })
    } catch (error) {
        console.log(error);
    }

})

router.post('/courses/edit', authMiddleware, async (req, res) => {
    try {
        const { id } = req.body
        delete req.body.id
        const course = await Course.findById(id)
        if (isOwner(course, req)) {
            return res.redirect('/courses')
        }
        Object.assign(course, req.body)
        await course.save()
        res.redirect('/courses')
    } catch (error) {
        console.log(error);
    }
})

router.post('/courses/remove', authMiddleware, async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.body.id)
        res.status(200).redirect('/courses')
    } catch (error) {
        console.log(error);
    }
})

router.get('/courses/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
        res.render('course', {
            layout: 'empty',
            title: `Course ${course.title}`,
            course
        })
    } catch (error) {
        console.log(error);
    }
})



export default router;