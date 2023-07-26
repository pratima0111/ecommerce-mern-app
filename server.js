import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import cors from 'cors';
import authRoutes from './routes/authRoute.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import path from 'path';

dotenv.config(); //to load the environment variables from the .env file

connectDB(); //establish connection to the MongoDB database

const app = express(); //creates an instance of the express application, app represents express server

//middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, './client/build')));

//routes
app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/product', productRoutes);

app.use('*', function (req, res) {
  res.sendFile(path.join(__dirname, './client/build/index.html'));
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`.bgCyan.white); //callback function executed after the server starts successfully
});
