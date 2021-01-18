import HomeScreen from './screen/HomeScreen';
import ProductScreen from './screen/ProductScreen';
import Error404Screen from './screen/Error404Screen';
import { parseRequestUrl } from './utils';
import CartScreen from './screen/CartScreen';
import SigninScreen from './screen/SigninScreen';
import Header from './components/Header';
import RegisterScreen from './screen/RegisterScreen';
import ProfileScreen from './screen/ProfileScreen';
import ShippingScreen from './screen/ShippingScreen';
import PaymentScreen from './screen/PaymentScreen';
import PlaceOrderScreen from './screen/PlaceOrderScreen';
import OrderScreen from './screen/OrderScreen';
import DashboardScreen from './screen/DashboardScreen';
import ProductListScreen from './screen/ProductListScreen';
import ProductEditScreen from './screen/ProductEditScreen';

const routes = { // notice that all the front-end routes are singular while the back-end routes are plural
    '/': HomeScreen,
    '/product/:id': ProductScreen,
    '/product/:id/edit': ProductEditScreen,
    '/order/:id': OrderScreen,
    '/cart/:id': CartScreen,
    '/cart': CartScreen,
    '/signin': SigninScreen,
    '/register': RegisterScreen,
    '/profile': ProfileScreen,
    '/shipping': ShippingScreen,
    '/payment': PaymentScreen,
    '/placeorder': PlaceOrderScreen,
    '/dashboard': DashboardScreen,
    '/productlist': ProductListScreen,
};
const router = async () => {
    /* The code below defines the different screens that will eventually be rendered */
    const request = parseRequestUrl();
    const parseUrl =
        (request.resource ? `/${request.resource}` : '/') +
        (request.id ? '/:id' : '') +
        (request.verb ? `/${request.verb}` : '');
    const screen = routes[parseUrl] ? routes[parseUrl] : Error404Screen;
    /* The code below renders the header in the main html file */
    const header = document.getElementById('header-container');
    header.innerHTML = await Header.render();
    await Header.after_render();
    /* The code below renders the screen picked above in the main html file */
    const main = document.getElementById('main-container');
    main.innerHTML = await screen.render();
    if (screen.after_render()) {
        await screen.after_render();
    }
};
window.addEventListener('load', router);
window.addEventListener('hashchange', router);
