import fastify from 'fastify';

const app = fastify();

app.get('/hello', () => {
  return 'Hello world! 😎';
});

app.listen(
  {
    port: 3333,
  },
  () => {
    console.log('HTTP Server is Running! 🚀');
  },
);
