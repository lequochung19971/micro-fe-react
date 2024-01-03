import { remoteNameConfig } from 'shared/configs';

export const remoteConfigs = Object.freeze({
  host: {
    name: remoteNameConfig.host,
  },
  product: {
    url: 'http://localhost:3001/remoteEntry.js',
    scope: 'product',
    name: remoteNameConfig.cart,
    pathname: '/products',
  },
  cart: {
    url: 'http://localhost:3002/remoteEntry.js',
    scope: 'cart',
    name: remoteNameConfig.cart,
    pathname: '/carts',
  },
});
