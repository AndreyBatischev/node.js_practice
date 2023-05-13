import express from 'express'
import exphbs from 'express-handlebars'
import routes from './routes/index.js'
import cardRoute from './routes/cardRoute.js'
import path from 'path'


import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))

app.use('/', routes)
app.use('/card', cardRoute)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})