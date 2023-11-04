const express = require('express');
require('dotenv').config()
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const adminAccountRoute = require('./routes/admin_account');
const adminRoute = require('./routes/admin');
const serviceRoute = require('./routes/service');
const serviceFeeRoute = require('./routes/service_fee');
const vehicleRoute = require('./routes/vehicle');
const customerRoute = require('./routes/customer');
const blogRoute = require('./routes/blog');
const commentBlogRoute = require('./routes/comment_blog');
const itemRoute = require('./routes/item');
const orderRoute = require('./routes/order');
const vnpayRoute = require('./routes/vnpay');
const driverRoute = require('./routes/driver');
const ratingDriverRoute = require('./routes/rating_driver');
const ratingServiceRoute = require('./routes/rating_service');
const driverAccountRoute = require('./routes/driver_account');
const notificationRoute = require('./routes/notification');


var cookieParser = require('cookie-parser')


const http = require('http');



//Socket.io
const { Server } = require('socket.io'); // Add this

//Cors
const cors = require("cors");

//Connect to mongodb Atlas
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI_ATLAS;

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
app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use('/uploads', express.static('uploads'))

const server = http.createServer(app);

// SOCKET.IO
// Add this
// Create an io server and allow for CORS from http://localhost:3000 with GET and POST methods
// const io = new Server(server, {
//     cors: {
//         origin: 'http://localhost:3000',
//         methods: ['GET', 'POST'],
//     },
// });

// io.on('connection', (socket) => {
//     if (!socket.connected) {
//         // Code chỉ chạy khi socket chưa được kết nối
//     }
//     console.log('New client connected');

//     socket.on('disconnect', () => {
//         console.log('Client disconnected');
//     });

//     // Khi có khách hàng tạo đơn hàng mới
//     socket.on("new_order", (dataOrderSend) => {
//         socket.emit("notify_new_order", dataOrderSend)
//     });
// });


//API - Routes
app.use("/v1/auth", authRoute);
app.use("/v1/user", userRoute);

//Admin Account Route
app.use("/v1/adminAccount", adminAccountRoute);

//Admin Route
app.use("/v1/admin", adminRoute);


//Service Route
app.use("/v1/service", serviceRoute);

//Service Fee Route
app.use("/v1/service_fee", serviceFeeRoute);

//Vehicle
app.use("/v1/vehicle", vehicleRoute);

//User Manager
app.use("/v1/customer", customerRoute)

//Blog 
app.use("/v1/blog", blogRoute)

//Comment Blog 
app.use("/v1/commentBlog", commentBlogRoute)

//Item 
app.use("/v1/item", itemRoute)

//Order 
app.use("/v1/order", orderRoute)

//Driver
app.use("/v1/driver", driverRoute)

//Driver
app.use("/v1/ratingDriver", ratingDriverRoute)

//Driver Account
app.use("/v1/driverAccount", driverAccountRoute)

//Rating Service
app.use("/v1/ratingService", ratingServiceRoute)

//Quản lí thông báo khi có đơn hàng mới !
app.use("/v1/notification", notificationRoute)

//Thanh toán với VN PAY
app.use("/v1/vnpay", vnpayRoute)


//Middleware Test First
app.get('/', (req, res) => {
    res.send('ok')
})

const PORT = 5000 || process.env.PORT

//Connect first before running server
connectDB().then(() => {
    server.listen(PORT, () => 'Server is running on port 5000');
    // const server = app.listen(PORT, () => {
    //     console.log(`Server is running on port ${PORT}`)
    // })


    //Socket.io

    // Add this
    // Listen for when the client connects via socket.io-client
    // io.on('connection', (socket) => {
    //     socket.on("message", (data) => {
    //         console.log(data)
    //         // Xử lý thông báo từ client
    //         // Gửi thông báo đến client
    //         socket.emit("message_send_from_server", {
    //             message: data,
    //         });
    //     });

    // We can write our socket event listeners in here...
    // });

})

