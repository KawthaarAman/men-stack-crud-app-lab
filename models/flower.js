const mongoose = require("mongoose");

const flowerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    inStock: {
        type: Boolean,
        default: true
    },
    price: {
        type: Number,
        min: 0,
        default: null
    },
    bestBefore: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

const Flower = mongoose.model("Flower", flowerSchema);

module.exports = Flower;
