export const PORTFOLIO_PENDING_QUERY = "portfolioPending";

export function registrationPaymentUrl(
  basePath: string,
  payment: string,
  portfolioPending: boolean,
): string {
  const params = new URLSearchParams({ payment });
  if (portfolioPending) {
    params.set(PORTFOLIO_PENDING_QUERY, "1");
  }
  return `${basePath}?${params.toString()}`;
}
