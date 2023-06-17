import { type FastifyInstance } from 'fastify';
import { z } from 'zod';
import { knex } from '../database';
import { randomUUID } from 'crypto';

const resource = 'transactions';

export async function transactionsRoutes(app: FastifyInstance): Promise<void> {
  app.get('/', async () => {
    const transactions = await knex(resource).select('*');
    return { transactions };
  });

  app.post('/', async (request, response) => {
    const createTransactionBodySchema = z.object({
      title: z.string().nonempty(),
      type: z.enum(['credit', 'debit']),
      amount: z.number().positive(),
    });

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body,
    );

    let sessionId = request.cookies.sessionId ?? '';
    if (sessionId === '') {
      sessionId = randomUUID();

      void response.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });
    }

    await knex(resource).insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : -amount,
      session_id: sessionId,
    });

    return await response.status(201).send();
  });

  app.get('/:id', async (request) => {
    const createTransactioParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = createTransactioParamsSchema.parse(request.params);
    const transaction = await knex(resource)
      .select('*')
      .where('id', id)
      .first();
    return { transaction };
  });

  app.get('/summary', async () => {
    const summary = await knex(resource)
      .sum('amount', { as: 'amount' })
      .first();
    return { summary };
  });
}
