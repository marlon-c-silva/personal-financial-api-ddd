import { Transaction } from '../entities/Transaction';

export interface ITransactionRepository {
  save(transaction: Transaction): Promise<void>;
  findById(id: string): Promise<Transaction | null>;
  findAll(): Promise<Transaction[]>;
  findByPeriod(startDate: Date, endDate: Date): Promise<Transaction[]>;
  findByCategory(categoryName: string): Promise<Transaction[]>;
  delete(id: string): Promise<boolean>;
}