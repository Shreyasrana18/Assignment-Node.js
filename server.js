const express = require('express');
const dotenv = require('dotenv').config();
const errorHandler = require('./Middlewares/errorHandler');
const connectDB = require('./Config/dbConnect');
const rateLimit = require("express-rate-limit");
const app = express();
connectDB();


const PORT = process.env.PORT === 'test' ? 5002 : 5001;

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 50, // 100 requests per 10 minutes
    message: { message: 'Too many requests, please try again later.' }
});
//  apply to all requests
app.use(limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./Routes/userAuthRoutes'));
app.use('/api/notes', require('./Routes/userNotesRoutes'));
app.use('/api/search', require('./Routes/userSearchRoutes'));

// Error handler
app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});