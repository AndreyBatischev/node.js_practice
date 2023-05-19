import { Schema, model } from 'mongoose'

const Course = new Schema({
    title: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    img: {
        type: String,
        required: false
    },

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

Course.method('toClient', function () {
    const course = this.toObject()

    course.id = course._id
    delete course._id
    return course
})

export default model('Course', Course)