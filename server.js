import express from 'express';

import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';

import dotenv from 'dotenv';
import connectDB from './src/helper/dbConnect.js';

// Initialize Express App
const app = express();

// Middleware
app.use(cors("*")); // Enable CORS
app.use(express.json());
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(morgan('dev')); // HTTP request logger

// Define a route for the root URL
app.get("/", (req, res) => {
  res.send("Hello");
});

import adminRouter from './src/router/adminRouter.js';
app.use('/api/auth', adminRouter); // Authentication routes


import eventRouter from './src/router/eventRouter.js';
app.use('/api/event',eventRouter)


const port =8000
app.listen(port, async () => {
    await connectDB();
    console.log("The server is listening on port ", port);
});
