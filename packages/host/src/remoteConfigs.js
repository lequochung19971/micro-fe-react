import { remoteNameConfig } from 'shared/configs';

export const remoteConfigs = Object.freeze({
  host: {
    name: remoteNameConfig.host,
  },
  product: {
    name: remoteNameConfig.product,
    url: `${process.env.PRODUCT_DOMAIN}remoteEntry.js`,
    scope: 'product',
    pathname: '/products',
  },
  cart: {
    name: remoteNameConfig.cart,
    url: `${process.env.CART_DOMAIN}remoteEntry.js`,
    scope: 'cart',
    pathname: '/carts',
  },
  auth: {
    name: remoteNameConfig.auth,
    url: `${process.env.AUTH_DOMAIN}remoteEntry.js`,
    scope: 'auth',
    pathname: '/auth',
  },
});
