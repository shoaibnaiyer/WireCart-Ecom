// const mongoose = require('mongoose')
import mongoose from 'mongoose';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                return emailRegex.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    address: {
        type: String,
        required: true,
    },
    mobile: {
        type: Number,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        enum: ['Customer', 'Seller', 'Admin'],
        default: 'Customer',
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;