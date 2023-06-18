import cookie from '@fastify/cookie';
import fastify from 'fastify';

import { knex } from './database';
import { transactionsRoutes } from './routes/transactions';

export const app = fastify();

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
