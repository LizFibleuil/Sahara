import { parseRequestUrl, rerender } from '../utils';
import { getProduct } from '../api';
import { getCartItems, setCartItems } from '../localStorage';

const addToCart = (item, forceUpdate = false) => {
  let cartItems = getCartItems();
  const existingItem = cartItems.find((selection) => selection.productId === item.productId);
  if (existingItem) {
    if (forceUpdate) {
      cartItems = cartItems.map((cartItem) => cartItem.productId === existingItem.productId ? item : cartItem);
    }
  } else {
    cartItems = [...cartItems, item];
  }
  setCartItems(cartItems);
  if (forceUpdate) {
    rerender(CartScreen);
  }
};
const removeFromCart = (id) => {
  setCartItems(getCartItems().filter((selection) => selection.productId !== id));
  if (id === parseRequestUrl().id) {
    document.location.hash = '/cart';
  } else {
    rerender(CartScreen);
  }
};

const CartScreen = {
  after_render: () => {
    const qtySelection = document.getElementsByClassName('qty-select');
    Array.from(qtySelection).forEach((qtySelect) => {
      qtySelect.addEventListener('change', (event) => {
        const item = getCartItems().find((selection) => selection.productId === qtySelect.id);
        addToCart({ ...item, qty: Number(event.target.value) }, true);
      });
    });
    const deleteButtons = document.getElementsByClassName('delete-button');
    Array.from(deleteButtons).forEach((deleteButton) => {
      deleteButton.addEventListener('click', () => {
        removeFromCart(deleteButton.id);
      });
    });
    document.getElementById('checkout-button').addEventListener('click', () => {
      document.location.hash = '/signin';
    });
  },
  render: async () => {
    /* localStorage.clear(); */
    const request = parseRequestUrl();
    if (request.id) {
      const product = await getProduct(request.id);
      addToCart({
        productId: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        qty: 1,
      });
    }
    const cartItems = getCartItems();
    return `
      <div class="content cart">
        <div class="cart-list">
          <ul class="cart-list-container">
            <li>
              <h3>Shopping Cart</h3>
              <div>Price</div>
            </li>
            ${cartItems.length === 0
                ? `<div>Your cart is empty. <a href="/#/">Go Shopping!</a></div>`
                : cartItems.map((item) => `
                    <li>
                      <div class="cart-image">
                        <img src="${item.image}" alt="${item.name}" />
                      </div>
                      <div class="cart-name">
                          <div>
                            <a href="/#/productId/${item.productId}">
                              ${item.name}
                            </a>
                          </div>
                          <div class='cart-qty'>
                            Qty: <select class="qty-select" id="${item.productId}">
                                  ${[...Array(item.countInStock).keys()].map((num) => item.qty === num + 1
                                    ? `<option selected value="${num + 1}">${num + 1}</option>`
                                    : `<option  value="${num + 1}">${num + 1}</option>`)}  
                                </select>
                                <button type="button" class="delete-button" id="${item.productId}">
                                  Delete
                                </button>
                          </div>
                      </div>
                      <div class="cart-price">
                        $${item.price}
                      </div>
                    </li>`).join('\n')
              } 
          </ul>
        </div>
        <div class="cart-action">
            <h3>Subtotal (${cartItems.reduce((a, c) => a + c.qty, 0)} items) : $${cartItems.reduce((a, c) => a + c.price * c.qty, 0).toFixed(2)}</h3>
            <button id="checkout-button" class="primary fw">
              Proceed to Checkout
            </button>
        </div>
      </div>
      `;
    },
};

export default CartScreen;
