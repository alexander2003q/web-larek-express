import cors from 'cors';
import { errors as celebrateErrors } from 'celebrate';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { DB_ADDRESS, ORIGIN_ALLOW, PORT } from './config';
import NotFoundError from './errors/not-found-error';
import errorHandler from './middlewares/error-handler';
import { errorLogger, requestLogger } from './middlewares/logger';
import orderRouter from './routes/order';
import productRouter from './routes/product';

const app = express();

app.use(cors({ origin: ORIGIN_ALLOW }));
app.use(requestLogger);
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/product', productRouter);
app.use('/order', orderRouter);

app.use((_req, _res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});

app.use(errorLogger);
app.use(celebrateErrors());
app.use(errorHandler);

mongoose.connect(DB_ADDRESS)
  .then(() => {
    app.listen(PORT);
  })
  .catch((error: Error) => {
    process.stderr.write(`Не удалось подключиться к MongoDB: ${error.message}\n`);
    process.exitCode = 1;
  });
