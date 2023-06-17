import fastify from 'fastify';
import { knex } from './database';

const app = fastify();

app.get('/hello', () => {
  return 'Hello world! 😎';
});

app.get('/knex', async () => {
  const tables = await knex('sqlite_schema').select('*');
  return tables;
});

app.listen(
  {
    port: 3333,
  },
  () => {
    console.log('HTTP Server is Running! 🚀');
  },
);
