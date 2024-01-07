import { remoteNameConfig } from 'shared/configs';

export const remoteConfigs = Object.freeze({
  host: {
    name: remoteNameConfig.host,
  },
  product: {
    name: remoteNameConfig.cart,
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
});
