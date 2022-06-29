const routes = [
  {
    path: '',
    action: () => {
      import('./views/home-view.js'); 
      return "<home-view />";
    },
  },
  {
    path: '/image/:imageName',
    action: (context) => {
      import('./views/image-view.js');
          return `<image-view image-name="${context.params.imageName}" />`;
    },
  },
];

const router = new UniversalRouter(routes);
export default router;