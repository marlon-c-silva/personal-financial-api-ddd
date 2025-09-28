import { Category } from '../../src/domain/entities/Category';

describe('Categoria', () => {
    const categorias = [
        new Category({
            name: 'Alimentação',
            keywords: ['restaurante', 'mercado', 'lanche']
        }),
        new Category({
            name: 'Transporte',
            keywords: ['uber', 'ônibus', 'gasolina']
        }),
    ];

    test('deve criar uma categoria com palavras-chave', () => {
        const categoria = new Category({
            name: 'Alimentação',
            keywords: ['restaurante']
        });

        expect(categoria.name).toBe('Alimentação');
        expect(categoria.keywords).toEqual(['restaurante']);
    });

    test('deve corresponder a uma descrição com palavra-chave', () => {
        expect(categorias[0]?.matches('Almoço no restaurante')).toBe(true);
        expect(categorias[0]?.matches('Compra no mercado')).toBe(true);
        expect(categorias[1]?.matches('Viagem de uber')).toBe(true);
    });

    test('não deve corresponder quando não houver palavra-chave', () => {
        expect(categorias[0]?.matches('Pagamento de aluguel')).toBe(false);
        expect(categorias[1]?.matches('Consulta médica')).toBe(false);
    });

    test('deve ser case insensitive na correspondência', () => {
        expect(categorias[0]?.matches('ALMOÇO NO RESTAURANTE')).toBe(true);
        expect(categorias[1]?.matches('VIAGEM DE UBER')).toBe(true);
    });

    test('deve categorizar transação automaticamente', () => {
        const categoria1 = Category.categorizeTransaction('Almoço no restaurante', categorias);
        expect(categoria1.name).toBe('Alimentação');

        const categoria2 = Category.categorizeTransaction('Viagem de uber', categorias);
        expect(categoria2.name).toBe('Transporte');

        const categoria3 = Category.categorizeTransaction('Pagamento de aluguel', categorias);
        expect(categoria3.name).toBe('Others');
    });

    test('deve retornar categoria padrão quando não encontrar correspondência', () => {
        const categoria = Category.categorizeTransaction('Despesa desconhecida', categorias);
        expect(categoria.name).toBe('Others');
        expect(categoria.keywords).toEqual([]);
    });
});