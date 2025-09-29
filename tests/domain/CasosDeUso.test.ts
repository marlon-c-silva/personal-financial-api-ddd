import { CreateTransactionUseCase } from '../../src/application/use-cases/CreateTransactionUseCase';
import { GetFinancialAnalysisUseCase } from '../../src/application/use-cases/GetFinancialAnalysisUseCase';
import { InMemoryTransactionRepository } from '../../src/infrastructure/repositories/InMemoryTransactionRepository';
import { InMemoryCategoryRepository } from '../../src/infrastructure/repositories/InMemoryCategoryRepository';

describe('CasosDeUso', () => {
  let criarTransacaoUseCase: CreateTransactionUseCase;
  let obterAnaliseFinanceiraUseCase: GetFinancialAnalysisUseCase;
  let transactionRepository: InMemoryTransactionRepository;
  let categoryRepository: InMemoryCategoryRepository;

  beforeEach(() => {
    transactionRepository = new InMemoryTransactionRepository();
    categoryRepository = new InMemoryCategoryRepository();
    criarTransacaoUseCase = new CreateTransactionUseCase(
      transactionRepository, 
      categoryRepository
    );
    obterAnaliseFinanceiraUseCase = new GetFinancialAnalysisUseCase(
      transactionRepository
    );
  });

  describe('CriarTransacaoUseCase', () => {
    test('deve criar uma transação com categorização automática', async () => {
      const transacao = await criarTransacaoUseCase.execute({
        description: 'Almoço no restaurante',
        amount: 50,
        type: 'DESPESA'
      });

      expect(transacao.description).toBe('Almoço no restaurante');
      expect(transacao.amount).toBe(50);
      expect(transacao.type).toBe('DESPESA');
      expect(transacao.category.name).toBe('Alimentação');
    });

    test('deve criar uma transação do tipo receita', async () => {
      const transacao = await criarTransacaoUseCase.execute({
        description: 'Salário mensal',
        amount: 3000,
        type: 'RECEITA'
      });

      expect(transacao.type).toBe('RECEITA');
      expect(transacao.category.name).toBe('Salário');
    });

    test('deve usar a data atual quando não for fornecida', async () => {
      const antes = new Date();
      const transacao = await criarTransacaoUseCase.execute({
        description: 'Teste',
        amount: 100,
        type: 'DESPESA'
      });
      const depois = new Date();

      expect(transacao.date.getTime()).toBeGreaterThanOrEqual(antes.getTime());
      expect(transacao.date.getTime()).toBeLessThanOrEqual(depois.getTime());
    });
  });

  describe('ObterAnaliseFinanceiraUseCase', () => {
    test('deve retornar análise financeira correta', async () => {
      // Criar algumas transações de teste
      await criarTransacaoUseCase.execute({
        description: 'Salário',
        amount: 3000,
        type: 'RECEITA'
      });

      await criarTransacaoUseCase.execute({
        description: 'Almoço',
        amount: 50,
        type: 'DESPESA'
      });

      await criarTransacaoUseCase.execute({
        description: 'Uber',
        amount: 25,
        type: 'DESPESA'
      });

      const analise = await obterAnaliseFinanceiraUseCase.execute();

      expect(analise.totalIncome.getValue()).toBe(3000);
      expect(analise.totalExpenses.getValue()).toBe(75);
      expect(analise.balance.getValue()).toBe(2925);
      expect(analise.categorySummaries.length).toBeGreaterThan(0);
    });

    test('deve lidar com lista vazia de transações', async () => {
      const analise = await obterAnaliseFinanceiraUseCase.execute();

      expect(analise.totalIncome.getValue()).toBe(0);
      expect(analise.totalExpenses.getValue()).toBe(0);
      expect(analise.balance.getValue()).toBe(0);
      expect(analise.categorySummaries).toHaveLength(0);
      expect(analise.topExpenses).toHaveLength(0);
    });
  });
});