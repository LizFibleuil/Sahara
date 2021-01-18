import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel'; // This is the MongoDb database connection
import { isAuth } from '../utils';

const orderRouter = express.Router();

/* Gets all order by current user from the database */
orderRouter.get('/mine', isAuth, expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.send(orders);
}));

/* Gets order from the database */
orderRouter.get('/:id', isAuth, expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        res.send(order);
    } else {
        res.status(404).send({ message: 'Order Not Found' });
    }
}));

/* Creates a new order in database */
orderRouter.post('/', isAuth, expressAsyncHandler(async (req, res) => {
    try {
        const order = new Order({
            orderItems: req.body.orderItems,
            user: req.user._id,
            shipping: req.body.shipping,
            payment: req.body.payment,
            itemsPrice: req.body.itemsPrice,
            taxPrice: req.body.taxPrice,
            shippingPrice: req.body.shippingPrice,
            totalPrice: req.body.totalPrice,
        });
        const createdOrder = await order.save();
        res.status(201).send({ message: 'New Order Created', order: createdOrder });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}));

/* Router that handles the payment from Paypal. It retrives information given by Paypal once the payment goes thru */
orderRouter.put('/:id/pay', isAuth, expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.payment.paymentResult = {
            orderrID: req.body.orderID,
            payerID: req.body.payerID,
            paymentID: req.body.paymentID,
        };
        const updatedOrder = await order.save();
        res.send({ message: 'Order Paid', order: updatedOrder });
    } else {
        res.status(404).send({ message: 'Order Not Found' });
    }
}));

export default orderRouter;
