import { FinancialAnalysisService } from '../../src/domain/services/FinancialAnalysisService';
import { Transaction } from '../../src/domain/entities/Transaction';
import { Category } from '../../src/domain/entities/Category';

describe('ServicoAnaliseFinanceira', () => {
  const alimentacao = new Category({ name: 'Alimentação', keywords: ['restaurante'] });
  const transporte = new Category({ name: 'Transporte', keywords: ['uber'] });
  const moradia = new Category({ name: 'Moradia', keywords: ['aluguel'] });
  const salario = new Category({ name: 'Salário', keywords: ['salário'] });

  const transacoes: Transaction[] = [
    new Transaction({
      id: '1',
      description: 'Almoço',
      amount: 45,
      date: new Date(),
      category: alimentacao,
      type: 'DESPESA'
    }),
    new Transaction({
      id: '2',
      description: 'Uber',
      amount: 20,
      date: new Date(),
      category: transporte,
      type: 'DESPESA'
    }),
    new Transaction({
      id: '3',
      description: 'Aluguel',
      amount: 950,
      date: new Date(),
      category: moradia,
      type: 'DESPESA'
    }),
    new Transaction({
      id: '4',
      description: 'Mercado',
      amount: 220,
      date: new Date(),
      category: alimentacao,
      type: 'DESPESA'
    }),
    new Transaction({
      id: '5',
      description: 'Salário',
      amount: 3000,
      date: new Date(),
      category: salario,
      type: 'RECEITA'
    }),
  ];

  const servico = new FinancialAnalysisService();

  test('deve calcular totais corretamente', () => {
    const resultado = servico.analyze(transacoes);

    expect(resultado.totalIncome.getValue()).toBe(3000);
    expect(resultado.totalExpenses.getValue()).toBe(45 + 20 + 950 + 220);
    expect(resultado.balance.getValue()).toBe(3000 - (45 + 20 + 950 + 220));
  });

  test('deve resumir categorias corretamente', () => {
    const resultado = servico.analyze(transacoes);

    const alimentacaoSummary = resultado.categorySummaries.find(c => c.category === 'Alimentação');
    const transporteSummary = resultado.categorySummaries.find(c => c.category === 'Transporte');
    const moradiaSummary = resultado.categorySummaries.find(c => c.category === 'Moradia');

    expect(alimentacaoSummary?.total.getValue()).toBe(45 + 220);
    expect(transporteSummary?.total.getValue()).toBe(20);
    expect(moradiaSummary?.total.getValue()).toBe(950);
  });

  test('deve calcular percentuais corretamente', () => {
    const resultado = servico.analyze(transacoes);

    const alimentacaoSummary = resultado.categorySummaries.find(c => c.category === 'Alimentação');
    const moradiaSummary = resultado.categorySummaries.find(c => c.category === 'Moradia');
    const totalDespesas = 45 + 20 + 950 + 220;

    expect(alimentacaoSummary?.percentage).toBeCloseTo((265 / totalDespesas) * 100, 2);
    expect(moradiaSummary?.percentage).toBeCloseTo((950 / totalDespesas) * 100, 2);
  });

  test('deve identificar os maiores gastos em ordem decrescente', () => {
    const resultado = servico.analyze(transacoes);

    expect(resultado.topExpenses).toHaveLength(3);
    expect(resultado.topExpenses[0]?.category).toBe('Moradia');
    expect(resultado.topExpenses[0]?.total.getValue()).toBe(950);
    expect(resultado.topExpenses[1]?.category).toBe('Alimentação');
    expect(resultado.topExpenses[1]?.total.getValue()).toBe(265);
    expect(resultado.topExpenses[2]?.category).toBe('Transporte');
    expect(resultado.topExpenses[2]?.total.getValue()).toBe(20);
  });

  test('deve contar o número de transações por categoria', () => {
    const resultado = servico.analyze(transacoes);

    const alimentacaoSummary = resultado.categorySummaries.find(c => c.category === 'Alimentação');
    const transporteSummary = resultado.categorySummaries.find(c => c.category === 'Transporte');

    expect(alimentacaoSummary?.transactionCount).toBe(2);
    expect(transporteSummary?.transactionCount).toBe(1);
  });

  test('deve lidar com lista vazia de transações', () => {
    const resultado = servico.analyze([]);

    expect(resultado.totalIncome.getValue()).toBe(0);
    expect(resultado.totalExpenses.getValue()).toBe(0);
    expect(resultado.balance.getValue()).toBe(0);
    expect(resultado.categorySummaries).toHaveLength(0);
    expect(resultado.topExpenses).toHaveLength(0);
  });
});