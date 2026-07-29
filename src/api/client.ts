export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function parseError(response: Response): Promise<never> {
  let message = `Request failed (${response.status})`;
  try {
    const body = (await response.json()) as { message?: string };
    if (body?.message) message = body.message;
  } catch {}
  throw new ApiError(message, response.status);
}

export async function apiGet<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) await parseError(response);
  return (await response.json()) as T;
}

export async function apiPatch<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) await parseError(response);
  return (await response.json()) as T;
}
