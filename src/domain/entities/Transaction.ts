import { Category } from "./Category";

export interface TransactionProps {
    id: string;
    description: string;
    amount: number;
    date: Date;
    category: Category;
    type: 'RECEITA' | 'DESPESA';
}

export class Transaction {
    constructor(private readonly props: TransactionProps) { }

    get id(): string {
        return this.props.id;
    }

    get description(): string {
        return this.props.description;
    }

    get amount(): number {
        return this.props.amount;
    }

    get date(): Date {
        return this.props.date;
    }

    get category(): Category {
        return this.props.category;
    }

    get type(): 'RECEITA' | 'DESPESA' {
        return this.props.type;
    }

    isExpense(): boolean {
        return this.type === 'DESPESA';
    }

    isIncome(): boolean {
        return this.type === 'RECEITA';
    }

    getAbsoluteAmount(): number {
        return Math.abs(this.amount);
    }
}