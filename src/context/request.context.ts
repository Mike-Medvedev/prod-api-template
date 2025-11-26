import { AsyncLocalStorage } from "node:async_hooks";

type RequestContext = {
  reqId: string;
  method: string;
  path: string;
  body: unknown;
};

export const requestContext = new AsyncLocalStorage<RequestContext>();
export type { RequestContext };
