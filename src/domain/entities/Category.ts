export interface CategoryProps {
    name: string;
    keywords: string[];
    allowedTypes?: ('RECEITA' | 'DESPESA')[];
}

export class Category {
    constructor(private readonly props: CategoryProps) { }

    get name(): string {
        return this.props.name;
    }

    get keywords(): string[] {
        return [...this.props.keywords];
    }

    get allowedTypes(): ('RECEITA' | 'DESPESA')[] {
        return this.props.allowedTypes || ['RECEITA', 'DESPESA'];
    }

    allowsType(transactionType: 'RECEITA' | 'DESPESA'): boolean {
        return this.allowedTypes.includes(transactionType);
    }

    matches(description: string): boolean {
        return this.keywords.some(keyword =>
            description.toLowerCase().includes(keyword.toLowerCase())
        );
    }

    static categorizeTransaction(description: string, categories: Category[]): Category {
        const foundCategory = categories.find(category =>
            category.matches(description)
        );

        return foundCategory || new Category({
            name: 'Others',
            keywords: []
        });
    }
}