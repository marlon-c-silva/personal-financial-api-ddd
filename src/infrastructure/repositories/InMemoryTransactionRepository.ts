import { Transaction } from '../../domain/entities/Transaction';
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository';

export class InMemoryTransactionRepository implements ITransactionRepository {
    private transactions: Transaction[] = [];

    async save(transaction: Transaction): Promise<void> {
        const existingIndex = this.transactions.findIndex(t => t.id === transaction.id);
        if (existingIndex >= 0) {
            this.transactions[existingIndex] = transaction;
        } else {
            this.transactions.push(transaction);
        }
    }

    async findById(id: string): Promise<Transaction | null> {
        return this.transactions.find(t => t.id === id) || null;
    }

    async findAll(): Promise<Transaction[]> {
        return [...this.transactions];
    }

    async findByPeriod(startDate: Date, endDate: Date): Promise<Transaction[]> {
        return this.transactions.filter(t =>
            t.date >= startDate && t.date <= endDate
        );
    }

    async findByCategory(categoryName: string): Promise<Transaction[]> {
        return this.transactions.filter(t =>
            t.category.name === categoryName
        );
    }

    async delete(id: string): Promise<boolean> {
        const index = this.transactions.findIndex(t => t.id === id);
        if (index >= 0) {
            this.transactions.splice(index, 1);
            return true;
        }
        return false;
    }
}