import { remoteNameConfig } from 'shared/configs';

export const remoteConfigs = Object.freeze({
  host: {
    name: remoteNameConfig.host,
  },
  product: {
    url: `${process.env.PRODUCT_DOMAIN}/remoteEntry.js`,
    scope: 'product',
    name: remoteNameConfig.cart,
    pathname: '/products',
  },
  cart: {
    url: `${process.env.CART_DOMAIN}/remoteEntry.js`,
    scope: 'cart',
    name: remoteNameConfig.cart,
    pathname: '/carts',
  },
});
