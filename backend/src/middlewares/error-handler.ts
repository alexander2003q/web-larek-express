import {
  NextFunction, Request, Response,
} from 'express';
import HttpError from '../errors/http-error';
import InternalServerError from '../errors/internal-server-error';

const isJsonSyntaxError = (error: Error) => (
  error instanceof SyntaxError
  && 'status' in error
  && error.status === 400
);

const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof HttpError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  if (isJsonSyntaxError(error)) {
    res.status(400).json({ message: 'Передан некорректный JSON' });
    return;
  }

  const internalServerError = new InternalServerError();

  res.status(internalServerError.statusCode).json({ message: internalServerError.message });
};

export default errorHandler;
