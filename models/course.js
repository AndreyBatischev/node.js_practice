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

export default model('Course', Course)