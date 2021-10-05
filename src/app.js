import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

import getDashboardController from './controllers/dashboardController';
import shareController from './controllers/shareController';

dotenv.config();
const PORT = process.env.PORT || 8080;

const app = express();

app.use(morgan('combined'));
app.use(cors({ origin: true }));
app.use(express.json());

// DEPRECATED: Remove this in the next major release
app.get('/', (req, res) => res.send('Server is running'));
app.get('/health', (_, res) => res.send({ health: 'OK' }));
app.get('/share', shareController);
app.post('/getDashboard', getDashboardController);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is listening at port ${PORT}`);
});
