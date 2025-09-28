import { FinancialAnalysisService, FinancialAnalysisResult } from '@domain/services/FinancialAnalysisService';
import { ITransactionRepository } from '@domain/repositories/ITransactionRepository';

export class GetFinancialAnalysisUseCase {
    constructor(private transactionRepository: ITransactionRepository) { }

    async execute(startDate?: Date, endDate?: Date): Promise<FinancialAnalysisResult> {
        let transactions = await this.transactionRepository.findAll();

        if (startDate && endDate) {
            transactions = transactions.filter(t =>
                t.date >= startDate && t.date <= endDate
            );
        }

        const analysisService = new FinancialAnalysisService();
        return analysisService.analyze(transactions);
    }
}