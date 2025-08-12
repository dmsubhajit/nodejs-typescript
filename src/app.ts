import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.get('/', (_req, res) => {
  res.send('Hello, TypeScript Node.js!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
