import { HttpError, UnknownError } from "@/errors/errors";

export const httpClient = {
  async get<T>(url: URL, options: RequestInit): Promise<T | undefined> {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        ...options,
      });
      if (!response.ok) throw new HttpError(response.statusText, { cause: response.status });
      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpError(error.message, { cause: error.cause });
      }
      throw new UnknownError(error);
    }
  },
  async post<T>(url: URL, payload: T, options: RequestInit): Promise<Partial<T> | undefined> {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        ...options,
      });
      if (!response.ok) throw new HttpError(response.statusText, { cause: response.status });
      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpError(error.message, { cause: error.cause });
      }
      throw new UnknownError(error);
    }
  },
  async delete(url: URL): Promise<void> {
    try {
      const response = await fetch(url, {
        method: "DELETE",
      });
      if (!response.ok) throw new HttpError(response.statusText, { cause: response.status });
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpError(error.message, { cause: error.cause });
      }
      throw new UnknownError(error);
    }
  },
};
