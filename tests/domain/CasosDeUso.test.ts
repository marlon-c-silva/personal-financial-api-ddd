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

      await criarTransacaoUseCase.execute({
        description: 'Salário',
        amount: 3200,
        type: 'RECEITA'
      });

      await criarTransacaoUseCase.execute({
        description: 'Almoço',
        amount: 40,
        type: 'DESPESA'
      });

      await criarTransacaoUseCase.execute({
        description: 'Uber',
        amount: 35,
        type: 'DESPESA'
      });

      const analise = await obterAnaliseFinanceiraUseCase.execute();

      expect(analise.totalIncome.getValue()).toBe(3200);
      expect(analise.totalExpenses.getValue()).toBe(75);
      expect(analise.balance.getValue()).toBe(3125);
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

  describe('CasosDeUso com Datas Passadas', () => {
  // ... beforeEach e outros testes

  test('deve criar transação com data específica no passado', async () => {
    const dataPassada = new Date(2023, 11, 25); // 25 de Dezembro de 2023
    
    const transacao = await criarTransacaoUseCase.execute({
      description: 'Ceia de Natal',
      amount: 200,
      type: 'DESPESA',
      date: dataPassada
    });

    expect(transacao.date.getUTCFullYear()).toBe(2023);
    expect(transacao.date.getUTCMonth()).toBe(11); // Dezembro = 11
    expect(transacao.date.getUTCDate()).toBe(25);
  });

  test('deve filtrar análise por período específico', async () => {
    // Transação em Janeiro 2024
    await criarTransacaoUseCase.execute({
      description: 'Almoço Janeiro',
      amount: 40,
      type: 'DESPESA',
      date: new Date(2024, 0, 15)
    });

    // Transação em Fevereiro 2024  
    await criarTransacaoUseCase.execute({
      description: 'Almoço Fevereiro',
      amount: 50,
      type: 'DESPESA',
      date: new Date(2024, 1, 15)
    });

    // Receita em Janeiro 2024
    await criarTransacaoUseCase.execute({
      description: 'Salário Janeiro',
      amount: 3000,
      type: 'RECEITA',
      date: new Date(2024, 0, 5)
    });

    // Análise apenas de Janeiro 2024
    const inicioJan = new Date(2024, 0, 1);
    const fimJan = new Date(2024, 0, 31);
    const analiseJan = await obterAnaliseFinanceiraUseCase.execute(inicioJan, fimJan);

    expect(analiseJan.totalIncome.getValue()).toBe(3000);
    expect(analiseJan.totalExpenses.getValue()).toBe(40);
    expect(analiseJan.balance.getValue()).toBe(2960);

    // Análise de Fevereiro 2024
    const inicioFev = new Date(2024, 1, 1);
    const fimFev = new Date(2024, 1, 29);
    const analiseFev = await obterAnaliseFinanceiraUseCase.execute(inicioFev, fimFev);

    expect(analiseFev.totalIncome.getValue()).toBe(0);
    expect(analiseFev.totalExpenses.getValue()).toBe(50);
    expect(analiseFev.balance.getValue()).toBe(-50);
  });
});
});