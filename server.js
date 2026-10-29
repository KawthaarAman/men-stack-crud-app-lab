// imports

const express = require("express") //importing express package

const app = express() // creates a express application

const dotenv = require("dotenv").config() //this allows me to use my .env values in this file

const mongoose = require("mongoose")

const methodOverride = require('method-override')

const morgan = require('morgan')

const Flower = require("./models/Flower")

// Middleware

app.use(express.static('public')) //all static files are in the public folderapp.use(express.urlencoded({ extended: false })); // this will allow us to see the data being sent in the POST or PUT

app.use(express.urlencoded({ extended: false }))

app.use(methodOverride('_method'))

app.use(morgan('dev'))

async function conntectToDB() { //connection to the database
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected to Database")
    }
    catch (error) {
        console.log("Error Occured", error)
    }
}

conntectToDB()

// HOME PAGE
app.get("/", (req, res) => {
    res.render("homepage.ejs")
})

// CREATE FLOWER PAGE
app.get("/flowers/new", (req, res) => {
    res.render("create-flower.ejs")
})

// CREATE FLOWER
app.post("/flowers", async (req, res) => {
    await Flower.create({
        name: req.body.name,
        inStock: req.body.inStock === "on",
        price: req.body.price === "" ? null : req.body.price,
        bestBefore: req.body.bestBefore || null
    })

    res.redirect("/flowers")
})

// ALL FLOWERS
app.get("/flowers", async (req, res) => {
    const allFlowers = await Flower.find()

    res.render("flower-list.ejs", {
        flowers: allFlowers
    })
})

// FLOWER DETAILS
app.get("/flowers/:flowerId", async (req, res) => {
    const foundFlower = await Flower.findById(req.params.flowerId)

    res.render("flower-details.ejs", {
        flower: foundFlower
    })
})

// EDIT FLOWER PAGE
app.get("/flowers/:flowerId/edit", async (req, res) => {
    const foundFlower = await Flower.findById(req.params.flowerId)

    res.render("edit-flower.ejs", {
        flower: foundFlower
    })
})

// UPDATE FLOWER
app.put("/flowers/:flowerId", async (req, res) => {
    await Flower.findByIdAndUpdate(
        req.params.flowerId,
        {
            name: req.body.name,
            inStock: req.body.inStock === "on",
            price: req.body.price === "" ? null : req.body.price,
            bestBefore: req.body.bestBefore || null
        },
        {
            runValidators: true
        }
    )

    res.redirect("/flowers")
})

// DELETE FLOWER
app.delete("/flowers/:flowerId", async (req, res) => {
    await Flower.findByIdAndDelete(req.params.flowerId)

    res.redirect("/flowers")
})

// START SERVER
app.listen(3000, () => {
    console.log("Listening on port 3000")
})
