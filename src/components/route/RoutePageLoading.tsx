type Props = {
  message?: string;
};

export function RoutePageLoading({
  message = "Carregando...",
}: Props) {
  return (
    <main className="flex min-h-[50vh] items-center justify-center px-6">
      <p className="text-sm text-muted-foreground">{message}</p>
    </main>
  );
}
