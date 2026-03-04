import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
  if (!API_URL) {
    return NextResponse.json(
      {
        message:
          "Backend não configurado. Defina API_URL ou NEXT_PUBLIC_API_URL no .env apontando para a API.",
      },
      { status: 503 }
    );
  }

  try {
    const body = await request.text();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    const authHeader = request.headers.get("Authorization");
    if (authHeader) headers["Authorization"] = authHeader;

    const res = await fetch(`${API_URL.replace(/\/$/, "")}/auth/fornecedor/register`, {
      method: "POST",
      body,
      headers,
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[auth/fornecedor/register]", err);
    return NextResponse.json(
      { message: "Erro ao comunicar com o backend." },
      { status: 502 }
    );
  }
}
