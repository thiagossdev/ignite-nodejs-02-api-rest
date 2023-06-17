// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Knex } from 'knex';

declare module 'knex/types/tables' {
  interface Transaction {
    id: string;
    session_id?: string;
    title: string;
    amount: number;
    created_at: string;
    updated_at: string;
  }

  interface Tables {
    transactions: Transaction;
  }
}
