import HttpError from './http-error';

class InternalServerError extends HttpError {
  constructor(message = 'На сервере произошла ошибка') {
    super(500, message);
  }
}

export default InternalServerError;
