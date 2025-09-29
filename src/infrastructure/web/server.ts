import express from 'express';
import { TransactionController } from './controllers/TransactionController';
import { errorHandler } from './middleware/errorHandler';
import { InMemoryTransactionRepository } from '../repositories/InMemoryTransactionRepository';
import { InMemoryCategoryRepository } from '../repositories/InMemoryCategoryRepository';
import { CreateTransactionUseCase } from '../../application/use-cases/CreateTransactionUseCase';
import { GetFinancialAnalysisUseCase } from '../../application/use-cases/GetFinancialAnalysisUseCase';
import { ListTransactionsUseCase } from '../../application/use-cases/ListTransactionsUseCase';

const transactionRepository = new InMemoryTransactionRepository();
const categoryRepository = new InMemoryCategoryRepository();

const createTransactionUseCase = new CreateTransactionUseCase(
    transactionRepository,
    categoryRepository
);
const getFinancialAnalysisUseCase = new GetFinancialAnalysisUseCase(
    transactionRepository
);
const listTransactionsUseCase = new ListTransactionsUseCase(
    transactionRepository
);

const transactionController = new TransactionController(
    createTransactionUseCase,
    getFinancialAnalysisUseCase,
    listTransactionsUseCase
);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.post('/transactions', (req, res) =>
    transactionController.createTransaction(req, res)
);

app.get('/transactions', (req, res) =>
    transactionController.listTransactions(req, res)
);

app.get('/analysis', (req, res) =>
    transactionController.getFinancialAnalysis(req, res)
);

app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'Financial DDD API'
    });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Server startup
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('=== Financial DDD API Server ===');
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`API Base URL: http://localhost:${PORT}`);
    console.log(`Health Check: http://localhost:${PORT}/health`);
    console.log('Available endpoints:');
    console.log('  POST   /transactions');
    console.log('  GET    /transactions');
    console.log('  GET    /analysis');
    console.log('================================');
});

export default app;