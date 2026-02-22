const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

type RequestConfig = RequestInit & {
  token?: string | null;
};

export async function apiClient<T>(
  path: string,
  options: RequestConfig = {}
): Promise<T> {
  const { token, headers: customHeaders, ...rest } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: {
      ...headers,
      ...(rest.body && typeof rest.body === "string"
        ? {}
        : { "Content-Type": "application/json" }),
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    const msg = Array.isArray(error.message)
      ? error.message.join(", ")
      : error.message ?? "Erro na requisição";
    throw new Error(msg);
  }

  return res.json();
}
