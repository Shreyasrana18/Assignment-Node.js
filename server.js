const express = require('express');
const dotenv = require('dotenv').config();
const errorHandler = require('./Middlewares/errorHandler');
const connectDB = require('./Config/dbConnect');
const app = express();
connectDB();


const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(errorHandler);
app.use('/api/auth', require('./Routes/userAuthRoutes'));
app.use('/api/notes', require('./Routes/userNotesRoutes'));
app.use('/api/search', (req, res) => {
    res.status(200).json({ message: 'search api' });
});


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});