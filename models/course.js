import { v4 } from 'uuid'
import fs from 'node:fs'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import path from 'path'
import { rejects } from 'node:assert';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class Course {
    constructor(title, price, img) {
        this.title = title
        this.price = price
        this.img = img
        this.id = v4()
    }

    toJSON() {
        return {
            title: this.title,
            price: this.price,
            img: this.img,
            id: this.id
        }
    }

    async save() {
        const courses = await Course.getAll()

        courses.push(this.toJSON())

        return new Promise((resolve, rejects) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'courses.json'),
                JSON.stringify(courses),
                (err) => {
                    if (err) {
                        rejects(err)

                    } else {
                        resolve()
                    }
                }
            )

        })

    }

    static getAll() {
        return new Promise((resolve, rejects) => {
            fs.readFile(
                path.join(__dirname, '..', 'data', 'courses.json'),
                'utf-8',
                (err, content) => {
                    if (err) {
                        rejects(err)
                    } else {
                        resolve(JSON.parse(content))
                    }
                }
            )
        })

    }

    static async update(course) {
        const courses = await Course.getAll()
        const idx = courses.findIndex(el => el.id === course.id)
        courses[idx] = course

        return new Promise((resolve, rejects) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'courses.json'),
                JSON.stringify(courses),
                (err) => {
                    if (err) {
                        rejects(err)

                    } else {
                        resolve()
                    }
                }
            )

        })
    }

    static async genOne(id) {
        const courses = await Course.getAll()
        return courses.find(el => el.id === id)


    }
}

export default Course