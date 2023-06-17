import setupKnex from 'knex';

export const knex = setupKnex({
  client: 'sqlite',
  connection: {
    filename: './tmp/db.sqlite',
  },
  useNullAsDefault: true,
});
