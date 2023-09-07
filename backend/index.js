const express = require('express');
require('dotenv').config()
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const adminRoute = require('./routes/admin');
const serviceRoute = require('./routes/service');
const serviceFeeRoute = require('./routes/service_fee');
const vehicleRoute = require('./routes/vehicle');
var cookieParser = require('cookie-parser')

//Cors
const cors = require("cors");

//Connect to mongodb Atlas
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI;

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(url, connectionParams);
        console.log(`Connect Successful - MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


//API - Routes
app.use("/v1/auth", authRoute);
app.use("/v1/user", userRoute);

//Admin Route
app.use("/v1/admin", adminRoute);

//Service Route
app.use("/v1/service", serviceRoute);

//Service Fee Route
app.use("/v1/service_fee", serviceFeeRoute);

//Vehicle
app.use("/v1/vehicle", vehicleRoute);

//Middleware Test First
app.get('/', (req, res) => {
    res.send('ok')
})

const PORT = 5000 || process.env.PORT

//Connect first before running server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
})

