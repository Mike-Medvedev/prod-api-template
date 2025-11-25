import logger from './logger.ts';


export function logError(error: Error, context = {}) {
  const base = {
    name: error.name,
    message: error.message,
    stack: error.stack,
    ...('query' in error ? { query: error.query } : {}),
    ...('code' in error ? { code: error.code } : {}),
    ...('detail' in error ? { detail: error.detail } : {}),
    ...context // e.g., { requestId, route, userId }
  };
  logger.error(base);
}
