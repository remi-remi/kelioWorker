import knexLib from 'knex';
import type { Knex } from 'knex';
import knexConfig from '../../knexfile';

export const db = knexLib(knexConfig.development) as Knex;

