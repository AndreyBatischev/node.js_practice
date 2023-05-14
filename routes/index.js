import { Router } from 'express';
import Course from '../models/course.js';
const router = Router();

router.get('/', (req, res) => {
    res.render('index', {
        title: 'Home page',
        isHome: true
    })
})

router.get('/add', (req, res) => {
    res.render('addCourse', {
        title: 'Add new course',
        isAdd: true
    })
})

router.post('/add', async (req, res) => {
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
    const courses = await Course.find({})
        .populate('userId', 'email name')
        .select('price title img')

    res.render('courses', {
        title: 'Courses',
        isCourses: true,
        courses
    })
})

router.get('/courses/:id/edit', async (req, res) => {
    if (!req.query.allow) {
        return redirect('/')
    }

    const course = await Course.findById(req.params.id)

    res.render('course-edit', {
        title: `Edit ${course.title}`,
        course
    })
})

router.post('/courses/edit', async (req, res) => {
    const { id } = req.body
    delete req.body.id
    await Course.findByIdAndUpdate(id, req.body)
    res.redirect('/courses')
})

router.post('/courses/remove', async (req, res) => {
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