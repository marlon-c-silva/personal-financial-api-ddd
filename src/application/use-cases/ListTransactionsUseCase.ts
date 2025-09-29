import { Transaction } from '../../domain/entities/Transaction';
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository';

export class ListTransactionsUseCase {
    constructor(private transactionRepository: ITransactionRepository) { }

    async execute(): Promise<Transaction[]> {
        return await this.transactionRepository.findAll();
    }
}