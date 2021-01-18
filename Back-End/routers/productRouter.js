import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Product from '../models/productModel';
import { isAdmin, isAuth } from '../utils';

const productRouter = express.Router();

productRouter.get('/', expressAsyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.send(products);
}));

productRouter.get('/:id', expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.send(product);
}));

productRouter.post('/', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const product = new Product({
        name: 'Sample Product',
        description: 'Sample Description',
        category: 'Sample Category',
        brand: 'Sample Brand',
        image: '/images/product-1.jpg',
    });
    const createdProduct = await product.save();
    if (createdProduct) {
        res.status(201).send({ message: 'Product Created', product: createdProduct });
    } else {
        res.status(500).send({ message: 'Error in Creating Product' });
    }
}));

productRouter.put('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
        product.name = req.body.name;
        product.price = req.body.price;
        product.image = req.body.image;
        product.brand = req.body.brand;
        product.countInStock = req.body.countInStock;
        product.category = req.body.category;
        product.description = req.body.description;
        const updatedProduct = product.save();
        if (updatedProduct) {
            res.send({ message: 'Product Updated', product: updatedProduct });
        } else {
            res.status(500).send({ message: 'Error in Updating Product' });
        }
    } else {
        res.status(404).send({ message: 'Product Not Found' });
    }
}));

export default productRouter;
