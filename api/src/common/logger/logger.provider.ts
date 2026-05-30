import logger from './logger';

export const LOGGER = 'LOGGER';

export const LoggerProvider = {
  provide: LOGGER,
  useValue: logger,
};
