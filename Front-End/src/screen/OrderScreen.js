/* eslint-disable object-curly-newline */
import { getOrder, getPaypalClientId, payOrder } from "../api";
import { hideLoading, parseRequestUrl, rerender, showLoading, showMessage } from "../utils";

const addPaypalSdk = async (totalPrice) => {
    const clientId = await getPaypalClientId();
    showLoading();
    if (!window.paypal) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://www.paypalobjects.com/api/checkout.js';
        script.async = true;
        script.onload = () => handlePayment(clientId, totalPrice);
        document.body.appendChild(script);
    } else {
        handlePayment(clientId, totalPrice);
    }
};
const handlePayment = (clientId, totalPrice) => {
    window.paypal.Button.render({
        env: 'sandbox',
        client: {
            sandbox: clientId,
            production: '',
        },
        locale: 'en_US',
        style: {
            size: 'responsive',
            color: 'gold',
            shape: 'pill',
        },
        commit: true,
        payment(data, actions) {
            /* This records the payment */
            return actions.payment.create({
                transactions: [
                    {
                    amount: {
                        total: totalPrice,
                        currency: 'USD',
                    },
                }],
            });
        },
        onAuthorize(data, actions) {
            /* This executes the payment, the data information is provided by Paypal */
            return actions.payment.execute().then(async () => {
                showLoading();
                await payOrder(parseRequestUrl().id, {
                    orderID: data.orderID,
                    payerID: data.payerID,
                    paymentID: data.paymentID,
                  });
                hideLoading();
                showMessage('Payment was successful', () => {
                    rerender(OrderScreen);
                });
            });
        },
    }, '#paypal-button').then(() => {
        hideLoading();
    });
};
const OrderScreen = {
    after_render: async () => {
        console.log('test');
    },
    render: async () => {
        const request = parseRequestUrl();
        const {
            _id,
            shipping,
            payment,
            orderItems,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
            isDelivered,
            deliveredAt,
            isPaid,
            paidAt,
        } = await getOrder(request.id);
        if (!isPaid) {
            addPaypalSdk(totalPrice);
        }
        return `
            <h2 class='order-title'>Order ${_id}</h2>
            <div class='order'>
                <div class='order-info'>
                    <div>
                        <h2>Shipping</h2>
                        <div>
                        ${shipping.address}, ${shipping.city}, ${shipping.postalCode}, 
                        ${shipping.country}
                        </div>
                        ${isDelivered ? `<div class='sucess'>Delivered at ${deliveredAt}</div>`
                                      : `<div class='error'>Not Delivered</div>`}
                    </div>
                    <div>
                        <h2>Payment</h2>
                        <div>
                        Payment Method: ${payment.paymentMethod}
                        </div>
                        ${isPaid ? `<div class='success'>Paid At ${paidAt}</div>`
                                      : `<div class='error'>Not Paid</div>`}
                    </div>
                    <div>
                        <ul class='cart-list-container'>
                            <li>
                                <h2>Shopping Cart</h2>
                                <div>Price</div>
                            </li>
                            ${orderItems.map((item) => `
                                <li>
                                    <div class='cart-image'>
                                        <img src="${item.image}" alt="${item.name}" />
                                    </div>
                                    <div class="cart-name">
                                        <div>
                                            <a href="/#/productId/${item.productId}">
                                            ${item.name}
                                            </a>
                                        </div>
                                        <div class='cart-qty'>Qty: ${item.qty}</div>
                                    </div>
                                    <div class="cart-price">
                                        $${item.price}
                                    </div>
                                </li>`)}
                        </ul>
                    </div>
                </div>
                <div class='order-action'>
                    <ul>
                        <li>
                            <h2>Order Summary</h2>
                        </li>
                        <li>
                            <div>Items</div>
                            <div>$${itemsPrice}</div>
                        </li>
                        <li>
                            <div>Shipping</div>
                            <div>$${shippingPrice}</div>
                        </li>
                        <li>
                            <div>Tax</div>
                            <div>$${taxPrice}</div>
                        </li>
                        <li class='total'>
                            <div>Order Total</div>
                            <div>$${totalPrice}</div>
                        </li>
                        <li>
                            <div id='paypal-button' class='fw'></div>
                        </li>
                    </ul>
                </div> 
            </div>`;
    },
};

export default OrderScreen;
