/* eslint-disable no-underscore-dangle */
import { getProducts } from '../api';
import Rating from '../components/Rating';
import { hideLoading, showLoading } from '../utils';

const HomeScreen = {
    render: async () => {
        showLoading();
        const products = await getProducts();
        if (products.error) {
            return `<div class='error'>${products.error}</div>`;
        }
        hideLoading();
        return `
            <ul class='products'>
                ${products.map(
                    (product) => `
                        <li>
                            <div class='product'>
                                <a href='/#/product/${product._id}'>
                                    <img src=${product.image} alt='${product.name}'>
                                </a>
                                <div class='product-name'>
                                    <a href='/#/product/${product._id}'>${product.name}</a>
                                </div>
                                <div class='product-rating'>
                                    ${Rating.render({ value: product.rating, text: `${product.numReviews} reviews` })}
                                </div>
                                <div class='product-brand'>
                                    <p>${product.brand}</p>
                                </div>
                                <div class='product-price'>
                                    <p>$${product.price}</p>
                                </div>
                            </div>
                        </li>`,
                ).join('\n')}
            `;
    },
};

export default HomeScreen;
