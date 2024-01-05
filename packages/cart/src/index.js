import('./bootstrap').then((module) => {
  const mount = module.default;
  const localRoot = document.getElementById('root');

  mount({
    mountPoint: localRoot,
    routingStrategy: 'browser',
  });
});

export {};
