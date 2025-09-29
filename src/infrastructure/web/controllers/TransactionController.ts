import { Request, Response } from 'express';
import { CreateTransactionUseCase } from '../../../application/use-cases/CreateTransactionUseCase';
import { GetFinancialAnalysisUseCase } from '../../../application/use-cases/GetFinancialAnalysisUseCase';
import { ListTransactionsUseCase } from '../../../application/use-cases/ListTransactionsUseCase';

export class TransactionController {
    constructor(
        private createTransactionUseCase: CreateTransactionUseCase,
        private getFinancialAnalysisUseCase: GetFinancialAnalysisUseCase,
        private listTransactionsUseCase: ListTransactionsUseCase
    ) { }

    async createTransaction(req: Request, res: Response): Promise<void> {
        try {
            const { description, amount, type, date } = req.body;

            if (!description || !amount || !type) {
                res.status(400).json({
                    error: 'Missing required fields: description, amount, type'
                });
                return;
            }

            if (type !== 'RECEITA' && type !== 'DESPESA') {
                res.status(400).json({
                    error: 'Type must be either RECEITA or DESPESA'
                });
                return;
            }

            const transaction = await this.createTransactionUseCase.execute({
                description,
                amount: Number(amount),
                type,
                date: date ? new Date(date) : undefined
            });

            res.status(201).json({
                id: transaction.id,
                description: transaction.description,
                amount: transaction.amount,
                date: transaction.date,
                category: transaction.category.name,
                type: transaction.type
            });
        } catch (error) {
            console.error('Error creating transaction:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async listTransactions(req: Request, res: Response): Promise<void> {
        try {
            const transactions = await this.listTransactionsUseCase.execute();

            const response = transactions.map(transaction => ({
                id: transaction.id,
                description: transaction.description,
                amount: transaction.amount,
                date: transaction.date,
                category: transaction.category.name,
                type: transaction.type
            }));

            res.json(response);
        } catch (error) {
            console.error('Error listing transactions:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getFinancialAnalysis(req: Request, res: Response): Promise<void> {
        try {
            const { startDate, endDate } = req.query;

            const analysis = await this.getFinancialAnalysisUseCase.execute(
                startDate ? new Date(startDate as string) : undefined,
                endDate ? new Date(endDate as string) : undefined
            );

            const response = {
                totalIncome: analysis.totalIncome.getValue(),
                totalExpenses: analysis.totalExpenses.getValue(),
                balance: analysis.balance.getValue(),
                categorySummaries: analysis.categorySummaries.map(summary => ({
                    category: summary.category,
                    total: summary.total.getValue(),
                    percentage: summary.percentage,
                    transactionCount: summary.transactionCount
                })),
                topExpenses: analysis.topExpenses.map(expense => ({
                    category: expense.category,
                    total: expense.total.getValue(),
                    percentage: expense.percentage,
                    transactionCount: expense.transactionCount
                }))
            };

            res.json(response);
        } catch (error) {
            console.error('Error getting financial analysis:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}