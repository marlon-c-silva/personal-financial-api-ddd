export class Money {
    constructor(
        private readonly amount: number,
    ) {
        if (amount < 0) {
            throw new Error('Money amount cannot be negative');
        }
    }

    getValue(): number {
        return this.amount;
    }

    format(): string {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
        }).format(this.amount);
    }

    add(other: Money): Money {
        return new Money(this.amount + other.amount);
    }

    subtract(other: Money): Money {
        return new Money(this.amount - other.amount);
    }
}