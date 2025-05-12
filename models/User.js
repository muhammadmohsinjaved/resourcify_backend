import mongoose from 'mongoose'
import validator from 'validator'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import crypto from 'crypto'

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    rollNo: {
        type: String,
        required: function () {
            return this.role === 'student'
        },
        // unique: [true, 'Roll number must be unique'],
    },

    password: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: [true, 'Email must be unique'],
        validate: validator.isEmail,
    },

    role: {
        type: String,
        required: true,
        enum: ['student', 'teacher', 'lab_attendant', 'librarian'],
        default: 'student',
    },

    gender: {
        type: String,
        required: true,
        enum: ['male', 'female'],
    },

    avatar: {
        url: {
            type: String,
            required: true,
            default: 'temp_url',
        },

        public_id: {
            type: String,
            required: true,
            default: 'temp_id',
        },
    },

    createdAt: {
        type: Date,
        default: Date.now(),
    },
})

schema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

schema.methods.getJWTToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
        expiresIn: '15d',
    })
}

schema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password)
}

schema.methods.getResetToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex')
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000

    return resetToken
}

export const User = mongoose.model('User', schema)
