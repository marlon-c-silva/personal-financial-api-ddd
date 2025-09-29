import { Category } from '../../domain/entities/Category';
import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository';

export class InMemoryCategoryRepository implements ICategoryRepository {
    private categories: Category[] = [
        new Category({
            name: 'Alimentação',
            keywords: ['restaurante', 'mercado', 'almoço', 'jantar', 'comida'],
            allowedTypes: ['DESPESA']
        }),
        new Category({
            name: 'Transporte',
            keywords: ['uber', 'ônibus', 'gasolina', 'táxi', 'metrô', 'combustível', 'combustivel'],
            allowedTypes: ['DESPESA']
        }),
        new Category({
            name: 'Moradia',
            keywords: ['aluguel', 'hipoteca', 'eletricidade', 'água', 'internet', 'condomínio'],
            allowedTypes: ['DESPESA']
        }),
        new Category({
            name: 'Lazer',
            keywords: ['cinema', 'filme', 'netflix', 'spotify', 'jogo'],
            allowedTypes: ['DESPESA']
        }),
        new Category({
            name: 'Saúde',
            keywords: ['médico', 'hospital', 'medicamento', 'farmácia', 'saúde'],
            allowedTypes: ['DESPESA']
        }),
        new Category({
            name: 'Salário',
            keywords: ['salário', 'pagamento', 'renda'],
            allowedTypes: ['RECEITA']
        }),
        new Category({
            name: 'Renda Extra',
            keywords: ['freelancer', 'bico', 'renda extra', 'salário', 'pagamento', 'renda'],
            allowedTypes: ['RECEITA']
        })
    ];

    async findAll(): Promise<Category[]> {
        return [...this.categories];
    }

    async findByName(name: string): Promise<Category | null> {
        return this.categories.find(c => c.name === name) || null;
    }

    async save(category: Category): Promise<void> {
        const existingIndex = this.categories.findIndex(c => c.name === category.name);
        if (existingIndex >= 0) {
            this.categories[existingIndex] = category;
        } else {
            this.categories.push(category);
        }
    }
}