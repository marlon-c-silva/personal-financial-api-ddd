import { Transaction } from '@domain/entities/Transaction';
import { Category } from '@domain/entities/Category';
import { ITransactionRepository } from '@domain/repositories/ITransactionRepository';
import { ICategoryRepository } from '@domain/repositories/ICategoryRepository';

export interface CreateTransaction {
    description: string;
    amount: number;
    type: 'RECEITA' | 'DESPESA';
    date?: Date;
}

export class CreateTransactionUseCase {
    constructor(
        private transactionRepository: ITransactionRepository,
        private categoryRepository: ICategoryRepository
    ) { }

    async execute(data: CreateTransaction): Promise<Transaction> {
        const categories = await this.categoryRepository.findAll();
        const category = Category.categorizeTransaction(data.description, categories);

        const transaction = new Transaction({
            id: Date.now().toString(),
            description: data.description,
            amount: data.amount,
            date: data.date || new Date(),
            category,
            type: data.type
        });

        await this.transactionRepository.save(transaction);
        return transaction;
    }
}