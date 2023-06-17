import fastify from 'fastify';
import cookie from '@fastify/cookie';

import { knex } from './database';
import { env } from './env';
import { transactionsRoutes } from './routes/transactions';

const app = fastify();

app.get('/hello', () => {
  return 'Hello world! 😎';
});

app.get('/knex', async () => {
  const tables = await knex('sqlite_schema').select('*');
  return tables;
});

void app.register(cookie).register(transactionsRoutes, {
  prefix: 'transactions',
});

app.listen(
  {
    port: env.PORT,
  },
  () => {
    console.log('HTTP Server is Running! 🚀');
  },
);
