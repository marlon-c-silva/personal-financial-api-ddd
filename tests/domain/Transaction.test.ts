import { Transaction } from '../../src/domain/entities/Transaction';
import { Category } from '../../src/domain/entities/Category';

describe('Transacao', () => {
    const categoriaAlimentacao = new Category({
        name: 'Alimentação',
        keywords: ['restaurante', 'mercado']
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

    test('deve identificar corretamente uma receita', () => {
        const transacao = new Transaction({
            id: '2',
            description: 'Salário',
            amount: 3000,
            date: new Date(),
            category: categoriaAlimentacao,
            type: 'RECEITA'
        });

        expect(transacao.isIncome()).toBe(true);
        expect(transacao.isExpense()).toBe(false);
    });

    test('deve retornar o valor absoluto corretamente', () => {
        const transacaoDespesa = new Transaction({
            id: '1',
            description: 'Almoço',
            amount: -50,
            date: new Date(),
            category: categoriaAlimentacao,
            type: 'DESPESA'
        });

        const transacaoReceita = new Transaction({
            id: '2',
            description: 'Salário',
            amount: 3000,
            date: new Date(),
            category: categoriaAlimentacao,
            type: 'RECEITA'
        });

        expect(transacaoDespesa.getAbsoluteAmount()).toBe(50);
        expect(transacaoReceita.getAbsoluteAmount()).toBe(3000);
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