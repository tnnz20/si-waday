import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';

import { logger } from '@/lib/logger.server';

/**
 * Global Server Middleware for React Router.
 * Intercepts incoming requests, loaders, and actions.
 */
export async function requestLogger(
  { request }: { request: Request },
  next: () => Promise<unknown>
): Promise<unknown> {
  const start = performance.now();
  const url = new URL(request.url);

  logger.info(`--> [${request.method}] ${url.pathname}${url.search}`);

  try {
    const response = await next();
    const duration = (performance.now() - start).toFixed(2);
    const status = response instanceof Response ? response.status : 200;
    logger.info(`<-- [${request.method}] ${url.pathname} ${status} (${duration}ms)`);
    return response;
  } catch (error) {
    const duration = (performance.now() - start).toFixed(2);
    logger.error(`<!- [${request.method}] ${url.pathname} Error (${duration}ms)`, { error });
    throw error;
  }
}

/**
 * Higher-Order Action Logger Wrapper for granular action-level logging.
 */
export function withActionLogger<T>(
  actionName: string,
  handler: (args: ActionFunctionArgs) => Promise<T> | T
) {
  return async (args: ActionFunctionArgs): Promise<T> => {
    const start = performance.now();
    const url = new URL(args.request.url);

    logger.info(`--> [Action:${actionName}] ${args.request.method} ${url.pathname}`);

    try {
      const result = await handler(args);
      const duration = (performance.now() - start).toFixed(2);
      logger.info(`<-- [Action:${actionName}] Success (${duration}ms)`);
      return result;
    } catch (error) {
      const duration = (performance.now() - start).toFixed(2);
      logger.error(`<!- [Action:${actionName}] Error (${duration}ms)`, { error });
      throw error;
    }
  };
}

/**
 * Higher-Order Loader Logger Wrapper for granular loader-level logging.
 */
export function withLoaderLogger<T>(
  loaderName: string,
  handler: (args: LoaderFunctionArgs) => Promise<T> | T
) {
  return async (args: LoaderFunctionArgs): Promise<T> => {
    const start = performance.now();
    const url = new URL(args.request.url);

    logger.info(`--> [Loader:${loaderName}] ${args.request.method} ${url.pathname}`);

    try {
      const result = await handler(args);
      const duration = (performance.now() - start).toFixed(2);
      logger.info(`<-- [Loader:${loaderName}] Success (${duration}ms)`);
      return result;
    } catch (error) {
      const duration = (performance.now() - start).toFixed(2);
      logger.error(`<!- [Loader:${loaderName}] Error (${duration}ms)`, { error });
      throw error;
    }
  };
}
