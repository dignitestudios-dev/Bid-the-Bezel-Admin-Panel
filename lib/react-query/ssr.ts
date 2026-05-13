import { QueryClient, dehydrate } from "@tanstack/react-query";

export async function createSSRQueryClient(
  prefetcher: (qc: QueryClient) => Promise<void>
) {
  const queryClient = new QueryClient();

  await prefetcher(queryClient);

  return {
    queryClient,
    dehydratedState: dehydrate(queryClient),
  };
}