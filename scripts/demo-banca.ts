import { Transaction } from '../src/domain/entities/Transaction';
import { Category } from '../src/domain/entities/Category';
import { FinancialAnalysisService } from '../src/domain/services/FinancialAnalysisService';
import { Money } from '../src/domain/value-objects/Money';
import { InMemoryTransactionRepository } from '../src/infrastructure/repositories/InMemoryTransactionRepository';
import { InMemoryCategoryRepository } from '../src/infrastructure/repositories/InMemoryCategoryRepository';
import { CreateTransactionUseCase } from '../src/application/use-cases/CreateTransactionUseCase';
import { GetFinancialAnalysisUseCase } from '../src/application/use-cases/GetFinancialAnalysisUseCase';

class DemoBanca {
  private transactionRepository: InMemoryTransactionRepository;
  private categoryRepository: InMemoryCategoryRepository;
  private createTransactionUseCase: CreateTransactionUseCase;
  private getAnalysisUseCase: GetFinancialAnalysisUseCase;
  private analysisService: FinancialAnalysisService;

  constructor() {
    this.transactionRepository = new InMemoryTransactionRepository();
    this.categoryRepository = new InMemoryCategoryRepository();
    this.createTransactionUseCase = new CreateTransactionUseCase(
      this.transactionRepository,
      this.categoryRepository
    );
    this.getAnalysisUseCase = new GetFinancialAnalysisUseCase(this.transactionRepository);
    this.analysisService = new FinancialAnalysisService();
  }

  async run(): Promise<void> {
    console.clear();
    this.printHeader();
    
    await this.demonstrateDomainModel();
    await this.demonstrateAutomaticCategorization();
    await this.demonstrateFinancialAnalysis();
    await this.demonstrateBusinessRules();
    await this.demonstrateUseCases();
    await this.demonstrateApiEndpoints();

    this.printConclusion();
  }

  private printHeader(): void {
    console.log('='.repeat(80));
    console.log('🎓 DEMONSTRAÇÃO PARA BANCA EXAMINADORA - TCC ENGENHARIA DE SOFTWARE');
    console.log('💰 SISTEMA DE GESTÃO FINANCEIRA PESSOAL COM DOMAIN-DRIVEN DESIGN');
    console.log('='.repeat(80));
    console.log();
  }

  private async demonstrateDomainModel(): Promise<void> {
    console.log('1. 🏗️  MODELAGEM DE DOMÍNIO (DDD)');
    console.log('   📐 Entidades, Value Objects e Serviços de Domínio');
    console.log();

    // Demonstração das Entidades
    const foodCategory = new Category({
      name: 'Alimentação',
      keywords: ['restaurante', 'mercado', 'lanche'],
    });

    const salaryCategory = new Category({
      name: 'Salário',
      keywords: ['salário', 'pagamento'],
      allowedTypes: ['RECEITA']
    });

    const transaction = new Transaction({
      id: '1',
      description: 'Almoço no restaurante',
      amount: 45.50,
      date: new Date('2024-01-15'),
      category: foodCategory,
      type: 'DESPESA'
    });

    console.log('   📦 ENTIDADE: Transaction');
    console.log(`      - Descrição: ${transaction.description}`);
    console.log(`      - Valor: R$ ${transaction.amount}`);
    console.log(`      - Tipo: ${transaction.type}`);
    console.log(`      - Categoria: ${transaction.category.name}`);
    console.log(`      - É despesa? ${transaction.isExpense()}`);
    console.log();

    console.log('   🎯 VALUE OBJECT: Money');
    const money = new Money(150.75);
    console.log(`      - Valor: ${money.getValue()}`);
    console.log(`      - Formatado: ${money.format()}`);
    console.log();

    console.log('   🔧 SERVIÇO DE DOMÍNIO: FinancialAnalysisService');
    console.log('      - Encapsula regras complexas de análise financeira');
    console.log('      - Isolado de infraestrutura e frameworks');
    console.log();

    console.log('─'.repeat(60));
    console.log();
  }

  private async demonstrateAutomaticCategorization(): Promise<void> {
    console.log('2. 🤖 CATEGORIZAÇÃO AUTOMÁTICA');
    console.log('   🎯 Sistema inteligente de classificação por palavras-chave');
    console.log();

    const testDescriptions = [
      'Almoço no restaurante Sabor Mineiro',
      'Gasolina no posto Shell',
      'Pagamento de aluguel',
      'Salário mensal',
      'Consulta médica no Dr. Silva',
      'Compra no mercado Extra',
      'Assinatura Netflix'
    ];

    const categories = await this.categoryRepository.findAll();

    console.log('   📋 TESTES DE CATEGORIZAÇÃO:');
    testDescriptions.forEach(description => {
      const category = Category.categorizeTransaction(description, categories);
      console.log(`      📝 "${description}"`);
      console.log(`         → 🏷️  ${category.name}`);
    });

    console.log();
    console.log('─'.repeat(60));
    console.log();
  }

  private async demonstrateFinancialAnalysis(): Promise<void> {
    console.log('3. 📊 ANÁLISE FINANCEIRA AVANÇADA');
    console.log('   💡 Insights acionáveis para tomada de decisão');
    console.log();

    // Criar transações de exemplo
    const sampleTransactions = await this.createSampleTransactions();
    const analysis = this.analysisService.analyze(sampleTransactions);

    console.log('   📈 VISÃO GERAL:');
    console.log(`      💰 Receitas Totais: ${analysis.totalIncome.format()}`);
    console.log(`      💸 Despesas Totais: ${analysis.totalExpenses.format()}`);
    console.log(`      ⚖️  Saldo: ${analysis.balance.format()}`);
    console.log(`      📊 Saúde Financeira: ${analysis.balance.getValue() >= 0 ? '✅ Positiva' : '❌ Negativa'}`);
    console.log();

    console.log('   🥇 TOP 3 GASTOS:');
    analysis.topExpenses.forEach((expense, index) => {
      const medals = ['🥇', '🥈', '🥉'];
      console.log(`      ${medals[index]} ${expense.category}: ${expense.total.format()} (${expense.percentage.toFixed(1)}%)`);
    });
    console.log();

    console.log('   📋 DETALHAMENTO POR CATEGORIA:');
    analysis.categorySummaries.forEach(summary => {
      const barLength = Math.max(1, Math.round(summary.percentage / 3));
      const bar = '█'.repeat(barLength);
      console.log(`      📦 ${summary.category.padEnd(15)} ${bar} ${summary.percentage.toFixed(1)}% (${summary.total.format()})`);
    });

    console.log();
    console.log('─'.repeat(60));
    console.log();
  }

  private async demonstrateBusinessRules(): Promise<void> {
    console.log('4. 🛡️  REGRAS DE NEGÓCIO (Invariantes de Domínio)');
    console.log('   🔒 Validações que garantem a consistência do sistema');
    console.log();

    const categories = await this.categoryRepository.findAll();
    const salaryCategory = categories.find(c => c.name === 'Salary')!;

    console.log('   ✅ CASO VÁLIDO: Salário como receita');
    try {
      const validTransaction = new Transaction({
        id: 'valid-1',
        description: 'Salário mensal',
        amount: 3000,
        date: new Date(),
        category: salaryCategory,
        type: 'RECEITA'
      });
      console.log(`      ✓ Transação criada: ${validTransaction.description} - R$ ${validTransaction.amount}`);
    } catch (error) {
      console.log(`      ❌ Erro inesperado: ${error}`);
    }

    console.log();
    console.log('   ❌ CASO INVÁLIDO: Tentativa de salário como despesa');
    try {
      const invalidTransaction = new Transaction({
        id: 'invalid-1',
        description: 'Salário como despesa?',
        amount: 3000,
        date: new Date(),
        category: salaryCategory,
        type: 'DESPESA' // Isso deve falhar!
      });
      console.log(`      ❌ Transação criada (isso não deveria acontecer!)`);
    } catch (error: any) {
      console.log(`      ✅ Regra aplicada: "${error.message}"`);
    }

    console.log();
    console.log('   🔄 OUTRAS REGRAS IMPLEMENTADAS:');
    console.log('      ✓ Valores de transação não podem ser negativos');
    console.log('      ✓ Categorias específicas só permitem certos tipos');
    console.log('      ✓ Data da transação não pode ser futura (opcional)');

    console.log();
    console.log('─'.repeat(60));
    console.log();
  }

  private async demonstrateUseCases(): Promise<void> {
    console.log('5. 🎯 CASOS DE USO (Application Layer)');
    console.log('   🚀 Orquestração entre domínio e infraestrutura');
    console.log();

    console.log('   📥 CRIANDO TRANSAÇÕES:');
    
    // Criar algumas transações via Use Case
    const transactionsToCreate = [
      { description: 'Almoço executivo', amount: 35, type: 'DESPESA' as const },
      { description: 'Salário empresa XYZ', amount: 2850, type: 'RECEITA' as const },
      { description: 'Combustível', amount: 180, type: 'DESPESA' as const }
    ];

    for (const transactionData of transactionsToCreate) {
      try {
        const transaction = await this.createTransactionUseCase.execute(transactionData);
        console.log(`      ✅ "${transaction.description}" - ${transaction.amount} - ${transaction.category.name}`);
      } catch (error: any) {
        console.log(`      ❌ Erro: ${error.message}`);
      }
    }

    console.log();
    console.log('   📊 OBTENDO ANÁLISE VIA USE CASE:');
    try {
      const analysis = await this.getAnalysisUseCase.execute();
      console.log(`      📈 Saldo atual: ${analysis.balance.format()}`);
      console.log(`      📋 Categorias analisadas: ${analysis.categorySummaries.length}`);
      console.log(`      🎯 Maior gasto: ${analysis.topExpenses[0]?.category || 'Nenhum'}`);
    } catch (error: any) {
      console.log(`      ❌ Erro na análise: ${error.message}`);
    }

    console.log();
    console.log('─'.repeat(60));
    console.log();
  }

  private async demonstrateApiEndpoints(): Promise<void> {
    console.log('6. 🌐 API REST (Infrastructure Layer)');
    console.log('   🔌 Endpoints disponíveis para integração');
    console.log();

    console.log('   📍 ENDPOINTS DISPONÍVEIS:');
    console.log('      POST /transactions    → Criar transação');
    console.log('      GET  /transactions    → Listar transações');
    console.log('      GET  /analysis        → Análise financeira completa');
    console.log('      GET  /analysis?startDate=...&endDate=... → Análise por período');
    console.log('      GET  /health          → Status do serviço');
    console.log();

    console.log('   💡 EXEMPLO DE REQUISIÇÃO:');
    console.log('      curl -X POST http://localhost:3000/transactions \\');
    console.log('        -H "Content-Type: application/json" \\');
    console.log('        -d \'{"description": "Almoço", "amount": 45, "type": "EXPENSE"}\'');
    console.log();

    console.log('   🛡️  CARACTERÍSTICAS DA API:');
    console.log('      ✅ Validação de dados de entrada');
    console.log('      ✅ Tratamento de erros padronizado');
    console.log('      ✅ Respostas em JSON');
    console.log('      ✅ Headers CORS configurados');

    console.log();
    console.log('─'.repeat(60));
    console.log();
  }

  private printConclusion(): void {
    console.log('7. 🎓 CONCLUSÕES E DIFERENCIAIS');
    console.log();

    console.log('   ✅ DOMAIN-DRIVEN DESIGN APLICADO:');
    console.log('      ✓ Linguagem Ubíqua incorporada no código');
    console.log('      ✓ Separação clara de responsabilidades');
    console.log('      ✓ Domínio rico com comportamentos');
    console.log('      ✓ Arquitetura hexagonal implementada');
    console.log();

    console.log('   ✅ VALOR PARA O USUÁRIO FINAL:');
    console.log('      ✓ Insights acionáveis sobre gastos');
    console.log('      ✓ Simplicidade para usuários leigos');
    console.log('      ✓ Foco em renda limitada (até R$ 3.000)');
    console.log('      ✓ Categorização automática inteligente');
    console.log();

    console.log('   ✅ ASPECTOS TÉCNICOS:');
    console.log('      ✓ Cobertura de testes abrangente');
    console.log('      ✓ Código em inglês (padrão mercado)');
    console.log('      ✓ Testes em português (facilita banca)');
    console.log('      ✓ Documentação completa');
    console.log();

    console.log('='.repeat(80));
    console.log('🎉 DEMONSTRAÇÃO CONCLUÍDA COM SUCESSO!');
    console.log('📚 Projeto válido para TCC de Engenharia de Software');
    console.log('👨‍💻 Desenvolvido por: Marlon C. Silva');
    console.log('='.repeat(80));
  }

  private async createSampleTransactions(): Promise<Transaction[]> {
    const categories = await this.categoryRepository.findAll();
    
    return [
      new Transaction({
        id: '1',
        description: 'Almoço restaurante',
        amount: 45,
        date: new Date('2024-01-15'),
        category: Category.categorizeTransaction('Almoço restaurante', categories),
        type: 'DESPESA'
      }),
      new Transaction({
        id: '2',
        description: 'Gasolina carro',
        amount: 180,
        date: new Date('2024-01-16'),
        category: Category.categorizeTransaction('Gasolina carro', categories),
        type: 'DESPESA'
      }),
      new Transaction({
        id: '3',
        description: 'Mercado mensal',
        amount: 220,
        date: new Date('2024-01-17'),
        category: Category.categorizeTransaction('Mercado mensal', categories),
        type: 'DESPESA'
      }),
      new Transaction({
        id: '4',
        description: 'Aluguel apartamento',
        amount: 950,
        date: new Date('2024-01-05'),
        category: Category.categorizeTransaction('Aluguel apartamento', categories),
        type: 'DESPESA'
      }),
      new Transaction({
        id: '5',
        description: 'Salário empresa',
        amount: 3000,
        date: new Date('2024-01-05'),
        category: Category.categorizeTransaction('Salário empresa', categories),
        type: 'RECEITA'
      }),
      new Transaction({
        id: '6',
        description: 'Consulta médica',
        amount: 150,
        date: new Date('2024-01-20'),
        category: Category.categorizeTransaction('Consulta médica', categories),
        type: 'DESPESA'
      }),
      new Transaction({
        id: '7',
        description: 'Cinema',
        amount: 80,
        date: new Date('2024-01-25'),
        category: Category.categorizeTransaction('Cinema', categories),
        type: 'DESPESA'
      })
    ];
  }
}

// Executar a demonstração
const demo = new DemoBanca();
demo.run().catch(console.error);