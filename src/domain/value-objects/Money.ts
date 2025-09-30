export class Money {
    constructor(
        private readonly amount: number,
    ) {
    }

    getValue(): number {
        return this.amount;
    }

    format(): string {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(this.amount);
    }

    add(other: Money): Money {
        return new Money(this.amount + other.amount);
    }

    subtract(other: Money): Money {
        return new Money(this.amount - other.amount);
    }
}