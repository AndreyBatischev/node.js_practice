import express from 'express'
import exphbs from 'express-handlebars'
import session from 'express-session'
import csrf from 'csurf'
import flash from 'connect-flash'
import { default as connectMongoDBSession } from 'connect-mongodb-session';
import mongoose from 'mongoose'
import routes from './routes/index.js'
import cardRoutes from './routes/cardRoutes.js'
import ordersRoutes from './routes/ordersRoutes.js'
import authRoutes from './routes/authRoutes.js'
import path from 'path'
import varMiddleware from './middleware/variables.js'
import userMiddleware from './middleware/user.js';
import keys from './keys/index.js'
import helper from './utils/hbs-helpers.js'

import { fileURLToPath } from 'url';
import { dirname } from 'path';



const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: helper,
    runtimeOptions: {
        allowProtoPropertiesByDefault: function (key) {
            return ['img', 'title', 'price'].includes(key);
        }
    }
})


const MongoDBStore = connectMongoDBSession(session);

var store = new MongoDBStore({
    collection: 'sessions',
    uri: keys.DB_URL
});

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))

app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}))
app.use(csrf())
app.use(flash())
app.use(varMiddleware)
app.use(userMiddleware)

app.use('/', routes)
app.use('/card', cardRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)

const PORT = process.env.PORT || 3000



async function start() {
    try {

        await mongoose.connect(keys.DB_URL, { useNewUrlParser: true })

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })

    } catch (error) {
        console.log(error);
    }
}

start()