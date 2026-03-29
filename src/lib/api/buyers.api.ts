import { apiClient } from "./client";

export type BuyerItem = {
  id: string;
  razaoSocial: string;
  nomeFantasia: string | null;
  website: string | null;
  redeSocial: string | null;
};

export type GetBuyersParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export type GetBuyersResponse = {
  data: BuyerItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getBuyers(
  params: GetBuyersParams = {}
): Promise<GetBuyersResponse> {
  const searchParams = new URLSearchParams();
  if (params.page != null) searchParams.set("page", String(params.page));
  if (params.limit != null) searchParams.set("limit", String(params.limit));
  if (params.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  const path = `/compradores${query ? `?${query}` : ""}`;

  return apiClient<GetBuyersResponse>(path);
}
