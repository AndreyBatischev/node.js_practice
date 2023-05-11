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
    const cousre = new Course(title, price, img)
    await cousre.save()
    res.redirect('/courses')
})

router.get('/courses', async (req, res) => {
    const courses = await Course.getAll()
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

    const course = await Course.genOne(req.params.id)

    res.render('course-edit', {
        title: `Edit ${course.title}`,
        course
    })
})

router.post('/courses/edit', async (req, res) => {
    await Course.update(req.body)
    res.redirect('/courses')
})

router.get('/courses/:id', async (req, res) => {
    const course = await Course.genOne(req.params.id)
    res.render('course', {
        layout: 'empty',
        title: `Course ${course.title}`,
        course
    })
})

export default router;