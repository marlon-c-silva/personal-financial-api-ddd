import { Category } from '../../domain/entities/Category';
import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository';

export class InMemoryCategoryRepository implements ICategoryRepository {
    private categories: Category[] = [
        new Category({
            name: 'Alimentação',
            keywords: ['restaurante', 'mercado', 'almoço', 'jantar', 'comida'],
        }),
        new Category({
            name: 'Transporte',
            keywords: ['uber', 'ônibus', 'gasolina', 'táxi', 'metrô', 'combustível'],
        }),
        new Category({
            name: 'Moradia',
            keywords: ['aluguel', 'hipoteca', 'eletricidade', 'água', 'internet', 'condomínio'],
        }),
        new Category({
            name: 'Lazer',
            keywords: ['cinema', 'filme', 'netflix', 'spotify', 'jogo'],
        }),
        new Category({
            name: 'Saúde',
            keywords: ['médico', 'hospital', 'medicamento', 'farmácia', 'saúde'],
        }),
        new Category({
            name: 'Salário',
            keywords: ['salário', 'pagamento', 'renda'],
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