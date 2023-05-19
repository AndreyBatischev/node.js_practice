import express from 'express'
import exphbs from 'express-handlebars'
import mongoose from 'mongoose'
import routes from './routes/index.js'
import cardRoutes from './routes/cardRoutes.js'
import ordersRoutes from './routes/ordersRoutes.js'
import authRoutes from './routes/authRoutes.js'
import User from './models/user.js'
import path from 'path'


import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: function (key) {
            return ['img', 'title', 'price'].includes(key);
        }
    }
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(async (req, res, next) => {
    try {
        const user = await User.findById('6450fb2c7ed7bfe922391726')
        req.user = user
        next()
    } catch (error) {
        console.log(error);
    }
})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))

app.use('/', routes)
app.use('/card', cardRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)

const PORT = process.env.PORT || 3000



async function start() {
    try {
        const DB_URL = 'mongodb+srv://user:user123qwe@restapi.gbi9szb.mongodb.net/?retryWrites=true&w=majority';
        await mongoose.connect(DB_URL, { useNewUrlParser: true })

        const candidate = await User.findOne()
        if (!candidate) {
            const user = new User({
                email: 'asd@asd.ru',
                name: 'Andrey',
                cart: { items: [] }
            })

            await user.save()
        }

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })

    } catch (error) {
        console.log(error);
    }
}

start()