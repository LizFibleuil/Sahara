/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* We use the package Babel to be able to use ES6 instead of ES5 coding in the back-end. Currently Node only reads ES5 if Babel is not used as a transpiler */
/* We use body-parser in order to be able to access the body of the request from the front-end */
/* Mongoose is used to access the MongoDB database */
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import data from './data';
import config from './config';
import userRouter from './routers/userRouter';
import orderRouter from './routers/orderRouter';
import productRouter from './routers/productRouter';
import uploadRouter from './routers/uploadRouter';

/* Below we are connecting to the database we have created */
mongoose.connect(config.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.log(error.reason);
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/uploads', uploadRouter);

app.get('/api/paypal/clientId', (req, res) => {
    res.send({ clientId: config.PAYPAL_CLIENT_ID });
});

/* app.get('/api/products', (req, res) => {
    res.send(data.products);
});

app.get('/api/products/:id', (req, res) => {
    const product = data.products.find((selection) => selection._id === req.params.id);
    if (product) {
        res.send(product);
    } else {
        res.status(404).send({ message: 'Product Not Found!' });
    }
}); */

app.use((err, req, res, next) => {
    const status = err.name && err.name === 'ValidationError' ? 400 : 500;
    res.status(status).send({ message: err.message });
});

app.listen(5000, () => {
    console.log('Server Listening at http://localhost:5000');
});
