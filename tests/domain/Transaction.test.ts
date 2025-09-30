import { Transaction } from '../../src/domain/entities/Transaction';
import { Category } from '../../src/domain/entities/Category';

describe('Transacao', () => {
    const categoriaAlimentacao = new Category({
        name: 'Alimentação',
        keywords: ['restaurante', 'mercado'],
        allowedTypes: ['DESPESA']
    });

    const categoriaSalario = new Category({
        name: 'Salário',
        keywords: ['salário', 'pagamento', 'renda'],
        allowedTypes: ['RECEITA']
    });

    test('deve criar uma transação com dados válidos', () => {
        const transacao = new Transaction({
            id: '1',
            description: 'Almoço no restaurante',
            amount: 50,
            date: new Date(),
            category: categoriaAlimentacao,
            type: 'DESPESA'
        });

        expect(transacao.id).toBe('1');
        expect(transacao.description).toBe('Almoço no restaurante');
        expect(transacao.amount).toBe(50);
        expect(transacao.category.name).toBe('Alimentação');
        expect(transacao.type).toBe('DESPESA');
    });

    test('deve permitir transação de receita com categoria Salário', () => {
        const transacao = new Transaction({
            id: '2',
            description: 'Salário',
            amount: 3000,
            date: new Date(),
            category: categoriaSalario,
            type: 'RECEITA'
        });

        expect(transacao.isIncome()).toBe(true);
        expect(transacao.category.name).toBe('Salário');
    });

    test('deve identificar corretamente uma despesa', () => {
        const transacao = new Transaction({
            id: '1',
            description: 'Almoço',
            amount: 50,
            date: new Date(),
            category: categoriaAlimentacao,
            type: 'DESPESA'
        });

        expect(transacao.isExpense()).toBe(true);
        expect(transacao.isIncome()).toBe(false);
    });

    test('deve lançar erro ao tentar criar despesa com categoria Salário', () => {
        expect(() => {
            new Transaction({
                id: '3',
                description: 'Salário como despesa?',
                amount: 3000,
                date: new Date(),
                category: categoriaSalario,
                type: 'DESPESA' // Isso deve falhar
            });
        }).toThrow("Category 'Salário' does not allow transaction type 'DESPESA'");
    });

    test('deve lançar erro ao tentar criar receita com categoria de despesa', () => {
        expect(() => {
            new Transaction({
                id: '4',
                description: 'Alimentação como receita?',
                amount: 50,
                date: new Date(),
                category: categoriaAlimentacao,
                type: 'RECEITA' // Isso deve falhar
            });
        }).toThrow("Category 'Alimentação' does not allow transaction type 'RECEITA'");
    });

    test('deve manter a imutabilidade das propriedades', () => {
        const transacao = new Transaction({
            id: '1',
            description: 'Almoço',
            amount: 50,
            date: new Date(),
            category: categoriaAlimentacao,
            type: 'DESPESA'
        });

        // As propriedades devem ser readonly
        expect(() => {
            // @ts-ignore - Testando imutabilidade
            transacao.id = '2';
        }).toThrow();
    });
});