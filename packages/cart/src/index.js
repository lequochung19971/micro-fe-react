import('./bootstrap').then((module) => {
  const mount = module.default;
  const localRoot = document.getElementById('root');

  mount(localRoot, {
    routingStrategy: 'standalone',
  });
});

export {};
