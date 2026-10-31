import { faker } from '@faker-js/faker';
import {
  NextFunction, Request, Response,
} from 'express';
import BadRequestError from '../errors/bad-request-error';
import Product from '../models/product';
import { IOrder } from '../types/order';

const createOrder = async (
  req: Request<Record<string, never>, unknown, IOrder>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const products = await Product.find({
      _id: { $in: req.body.items },
    });
    const productsById = new Map(products.map((product) => [product.id, product]));
    const missingProductId = req.body.items.find((id) => !productsById.has(id));

    if (missingProductId) {
      next(new BadRequestError(`Товар с id ${missingProductId} не найден`));
      return;
    }

    const unavailableProductId = req.body.items.find(
      (id) => productsById.get(id)?.price === null,
    );

    if (unavailableProductId) {
      next(new BadRequestError(`Товар с id ${unavailableProductId} не продается`));
      return;
    }

    const calculatedTotal = req.body.items.reduce((total, id) => (
      total + (productsById.get(id)?.price ?? 0)
    ), 0);

    if (calculatedTotal !== req.body.total) {
      next(new BadRequestError('Неверная сумма заказа'));
      return;
    }

    res.json({
      id: faker.string.uuid(),
      total: req.body.total,
    });
  } catch (error: unknown) {
    next(error);
  }
};

export default createOrder;
