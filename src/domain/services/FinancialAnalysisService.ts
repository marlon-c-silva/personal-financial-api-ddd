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