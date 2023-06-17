import { type FastifyInstance } from 'fastify';
import { z } from 'zod';
import { knex } from '../database';
import { randomUUID } from 'crypto';

const resource = 'transactions';

export async function transactionsRoutes(app: FastifyInstance): Promise<void> {
  app.post('/', async (request, response) => {
    const createTransactionBodySchema = z.object({
      title: z.string().nonempty(),
      type: z.enum(['credit', 'debit']),
      amount: z.number().positive(),
    });

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body,
    );

    await knex(resource).insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : -amount,
    });

    return await response.status(201).send();
  });

  app.get('/', async () => {
    return await knex(resource).select('*');
  });
}
