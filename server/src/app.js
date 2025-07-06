import express from 'express'
import morgan from 'morgan';
import cors from 'cors';

import llmRoutes from './routes/llm.routes.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors({ origin: '*' }));

app.get('/', (req, res) => {
    res.status(200).json({status: 'Server is running'});
})
app.use('/api/v1/llm', llmRoutes);

export default app;