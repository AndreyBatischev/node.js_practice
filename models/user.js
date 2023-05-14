import { Schema, model } from 'mongoose'

const User = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },

    cart: {
        items: [{
            count: {
                type: Number,
                required: true,
                default: 1
            },
            courseId: {
                type: Schema.Types.ObjectId,
                ref: 'Course',
                required: true,
                // auto: true
            }
        }]
    }
})

export default model('User', User)