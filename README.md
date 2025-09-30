# Personal Financial API - Domain-Driven Design

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![DDD](https://img.shields.io/badge/Architecture-Domain--Driven%20Design-orange)
![Tests](https://img.shields.io/badge/Tests-Jest-red)

Uma API robusta para gestão de finanças pessoais construída com Domain-Driven Design (DDD), focada em fornecer insights claros e acionáveis sobre gastos e receitas.

## 🎯 Objetivo

Fornecer uma ferramenta simples e eficaz para pessoas com renda limitada (em torno de R$ 3.000,00 mensais) controlarem suas finanças, identificando padrões de gastos e categorias que necessitam de atenção.

## ✨ Funcionalidades

- **Cadastro de Transações** - Registro de receitas e despesas com categorização automática
- **Análise Financeira** - Insights sobre gastos por categoria e percentuais
- **Categorização Inteligente** - Sistema automático baseado em palavras-chave
- **Relatórios Detalhados** - Top gastos, saldo total e análise por período
- **Validações de Domínio** - Regras de negócio como "Salário não pode ser despesa"

## 🏗️ Arquitetura

### Domain-Driven Design (DDD)

```
src/
├── domain/                 # Núcleo do Negócio
│   ├── entities/          # Entidades (Transaction, Category)
│   ├── value-objects/     # Objetos de Valor (Money, Period)
│   ├── services/          # Serviços de Domínio
│   └── repositories/      # Interfaces de Repositório
├── application/           # Camada de Aplicação
│   ├── use-cases/        # Casos de Uso
│   └── dtos/             # Objetos de Transferência de Dados
└── infrastructure/        # Infraestrutura
    ├── repositories/      # Implementações de Repositório
    └── web/              # Controladores REST e Servidor
```

### Princípios Implementados

- **Linguagem Ubíqua** - Termos do domínio financeiro refletidos no código
- **Entidades com Comportamento** - Regras de negócio encapsuladas
- **Value Objects** - Conceitos como Money e Period com validações
- **Separação de Camadas** - Domínio isolado da infraestrutura
- **Inversão de Dependência** - Repositórios com interfaces

## 🚀 Tecnologias

- **Node.js** - Ambiente de execução
- **TypeScript** - Linguagem com tipagem estática
- **Jest** - Framework de testes
- **Express.js** - Servidor web
- **Architecture** - Domain-Driven Design + Clean Architecture

## 📦 Instalação

```bash
# Clonar o repositório
git clone https://github.com/marlon-c-silva/personal-financial-api-ddd.git
cd personal-financial-api-ddd

# Instalar dependências
npm install

# Executar testes
npm test

# Executar em modo desenvolvimento
npm run dev

# Executar demonstração
npm run demo
```

## 🧪 Testes

Os testes estão escritos em português para facilitar a avaliação pela banca examinadora:

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch
```

## 📡 API Endpoints

### Transações

**POST /transactions**
```bash
curl -X POST http://localhost:3000/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Almoço no restaurante",
    "amount": 45.50,
    "type": "EXPENSE"
  }'
```

**GET /transactions**
```bash
curl http://localhost:3000/transactions
```

### Análise Financeira

**GET /analysis**
```bash
# Análise completa
curl http://localhost:3000/analysis

# Análise por período
curl "http://localhost:3000/analysis?startDate=2024-01-01&endDate=2024-01-31"
```

**GET /health**
```bash
curl http://localhost:3000/health
```

## 💡 Exemplos de Uso

### Cenário: Identificar Maiores Gastos

```typescript
// O sistema automaticamente categoriza e identifica:
{
  "topExpenses": [
    { "category": "Moradia", "total": 950, "percentage": 65.5 },
    { "category": "Alimentação", "total": 265, "percentage": 18.3 },
    { "category": "Transporte", "total": 180, "percentage": 12.4 }
  ]
}
```

### Regras de Negócio Implementadas

1. **Categorização Automática**
   - "Almoço no restaurante" → Categoria "Alimentação"
   - "Viagem de Uber" → Categoria "Transporte"

2. **Validações de Domínio**
   - Categoria "Salário" não aceita transações do tipo "DESPESA"
   - Valores de transação não podem ser negativos

3. **Análise Inteligente**
   - Cálculo de percentuais por categoria
   - Identificação dos top 3 gastos
   - Saldo total (receitas - despesas)

## 🎓 Para o TCC

Este projeto demonstra:

### Conceitos de DDD Aplicados
- **Modelagem Estratégica**: Contexto Delimitado "Gestão Financeira Pessoal"
- **Modelagem Tática**: Entidades, Value Objects, Serviços de Domínio
- **Arquitetura Hexagonal**: Domínio isolado da infraestrutura

### Validação Acadêmica
- **Testes em Português**: Facilitam a avaliação pela banca
- **Documentação Completa**: Explicação das decisões de design
- **Código Production-Ready**: Boas práticas e padrões de mercado

### Diferenciais
- **Foco em Usuários de Baixa Renda**: Solução simples para problemas complexos
- **Insights Acionáveis**: Mais que registro, oferece análise
- **Arquitetura Sustentável**: Fácil manutenção e evolução

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é desenvolvido para fins acadêmicos como Trabalho de Conclusão de Curso.

## 👨‍💻 Autor

**Marlon C. Silva** 
- GitHub: [@marlon-c-silva](https://github.com/marlon-c-silva)
- Projeto desenvolvido para TCC de Engenharia de Software

---

**🚀 Comece agora a controlar suas finanças de forma inteligente!**