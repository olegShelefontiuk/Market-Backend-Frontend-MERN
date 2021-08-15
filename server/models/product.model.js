const mongoose = require("mongoose");
const { model} = require("mongoose")

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    image: {
        data: Buffer,
        contentType: String
    },
    description: {
        type: String,
        trim: true
    },
    category:{
        type: String
    },
    quantity:{
        type: Number,
        required: "Quantity is required"
    },
    price:{
        type: Number,
        required: "Price is required"
    },
    shop:{
        type: mongoose.Schema.ObjectId,
        ref: 'Shop'
    },
    updated: Date,
    created: {
        type: Date,
        default: Date.now
    }
})
module.exports = model('Product',ProductSchema )