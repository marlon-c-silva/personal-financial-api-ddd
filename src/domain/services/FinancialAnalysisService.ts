import { Transaction } from '../entities/Transaction';
import { Money } from '../value-objects/Money';

export interface CategorySummary {
    category: string;
    total: Money;
    percentage: number;
    transactionCount: number;
}

export interface FinancialAnalysisResult {
    totalIncome: Money;
    totalExpenses: Money;
    balance: Money;
    categorySummaries: CategorySummary[];
    topExpenses: CategorySummary[];
}

export class FinancialAnalysisService {
    public analyze(transactions: Transaction[]): FinancialAnalysisResult {
        const incomeTransactions = transactions.filter(t => t.isIncome());
        const expenseTransactions = transactions.filter(t => t.isExpense());

        const totalIncome = this.calculateTotal(incomeTransactions);
        const totalExpenses = this.calculateTotal(expenseTransactions);
        const balance = new Money(totalIncome.getValue() - totalExpenses.getValue());

        const categorySummaries = this.calculateCategorySummaries(expenseTransactions, totalExpenses);
        const topExpenses = this.getTopExpenses(categorySummaries, 3);

        return {
            totalIncome,
            totalExpenses,
            balance,
            categorySummaries,
            topExpenses
        };
    }

    private calculateTotal(transactions: Transaction[]): Money {
        return transactions.reduce(
            (total, transaction) => total.add(new Money(transaction.getAbsoluteAmount())),
            new Money(0)
        );
    }

    private calculateCategorySummaries(
        transactions: Transaction[],
        totalExpenses: Money
    ): CategorySummary[] {
        const categoryMap = new Map<string, { total: Money; count: number }>();

        transactions.forEach(transaction => {
            const categoryName = transaction.category.name;
            const current = categoryMap.get(categoryName) || { total: new Money(0), count: 0 };

            categoryMap.set(categoryName, {
                total: current.total.add(new Money(transaction.getAbsoluteAmount())),
                count: current.count + 1
            });
        });

        return Array.from(categoryMap.entries()).map(([category, data]) => ({
            category,
            total: data.total,
            percentage: totalExpenses.getValue() > 0
                ? (data.total.getValue() / totalExpenses.getValue()) * 100
                : 0,
            transactionCount: data.count
        }));
    }

    private getTopExpenses(categorySummaries: CategorySummary[], limit: number): CategorySummary[] {
        return [...categorySummaries]
            .sort((a, b) => b.total.getValue() - a.total.getValue())
            .slice(0, limit);
    }
}