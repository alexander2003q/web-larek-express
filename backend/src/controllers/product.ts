import {
  NextFunction, Request, Response,
} from 'express';
import mongoose from 'mongoose';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import Product, { IProductInput } from '../models/product';

const isDuplicateKeyError = (error: unknown) => (
  error instanceof Error && error.message.includes('E11000')
);

export const getProducts = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const items = await Product.find({});

    res.json({
      items,
      total: items.length,
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const createProduct = async (
  req: Request<Record<string, never>, unknown, IProductInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json(product);
  } catch (error: unknown) {
    if (error instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError('Ошибка валидации данных при создании товара'));
      return;
    }

    if (isDuplicateKeyError(error)) {
      next(new ConflictError('Товар с таким названием уже существует'));
      return;
    }

    next(error);
  }
};
