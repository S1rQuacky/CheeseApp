//Dependencies 
require("dotenv").config();
const {PORT = 3000, MONGODB_URL} = process.env;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
//middleware
const cors = require("cors");
const morgan = require("morgan");

//Database connection
//////////////////////
//establish connection 
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

//connection events
mongoose.connection
    .on("open", () => console.log("Connected to MongoDB"))
    .on("close", () => console.log("Disconnected from MongoDB"))
    .on("error", (error) => console.log(error));

//Models
const CheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String
});

const Cheese = mongoose.model("Cheese", CheeseSchema);

//Middleware 
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())

//Routes
///////////
//test route
app.get("/", (req, res) => {
    res.send("It's not easy, being Cheesy");
});

//Index Route
app.get("/cheese", async (req, res) => {
    try {
        res.json(await Cheese.find({}));
    } catch (error) {
        res.status(400).json(error);
    }
});

//Create Route
app.post("/cheese", async (req, res) => {
    try {
        res.json(await Cheese.create(req.body));
    } catch (error) {
        res.status(400).json(error);
    }
});

//Update Route
app.put("/cheese/:id", async (req, res) => {
    try {
        res.json(
            await Cheese.findByIdAndUpdate(req.params.id, req.body,
                {new: true})
        )
    } catch (error){
        res.status(400).json({error})
    }
});

app.delete("/cheese/:id", async (req, res) => {
    try {
        res.json(await Cheese.findByIdAndRemove(req.params.id))
    } catch (error){
        res.status(400).json({error})
    }
})

//Listener
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));