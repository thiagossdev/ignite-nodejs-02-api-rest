import { type FastifyInstance } from 'fastify';
import { z } from 'zod';
import { knex } from '../database';
import { randomUUID } from 'crypto';
import { checkSessionIdExists } from '../middlewares/check-session-id-exists';

const resource = 'transactions';

export async function transactionsRoutes(app: FastifyInstance): Promise<void> {
  app.addHook('preHandler', async (request) => {
    console.log(`[${request.method}] ${request.url}`);
  });

  app.get(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const { sessionId } = request.cookies;

      const transactions = await knex(resource)
        .where('session_id', sessionId)
        .select();
      return { transactions };
    },
  );

  app.post('/', async (request, reply) => {
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

      void reply.cookie('sessionId', sessionId, {
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

    return await reply.status(201).send();
  });

  app.get(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const createTransactioParamsSchema = z.object({
        id: z.string().uuid(),
      });
      const { sessionId } = request.cookies;

      const { id } = createTransactioParamsSchema.parse(request.params);
      const transaction = await knex(resource)
        .select('*')
        .where({
          session_id: sessionId,
          id,
        })
        .first();

      if (transaction == null) {
        return await reply.status(404).send({
          error: 'Transaction not found',
        });
      }
      return { transaction };
    },
  );

  app.get(
    '/summary',
    { preHandler: [checkSessionIdExists] },
    async (request) => {
      const { sessionId } = request.cookies;
      const summary = await knex(resource)
        .sum('amount', { as: 'amount' })
        .where('session_id', sessionId)
        .first();
      return { summary };
    },
  );
}
