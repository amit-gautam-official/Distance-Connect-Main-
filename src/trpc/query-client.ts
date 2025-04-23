import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";
import SuperJSON from "superjson";

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // staleTime: Depends on data volatility
        // - Real-time data: 0-30 seconds
        // - Semi-dynamic data: 1-5 minutes (60000-300000 ms)
        // - Rarely changing data: 5+ minutes
        staleTime: 60 * 1000, // 1 minute is a good middle ground
        
        // gcTime: Should always be greater than staleTime
        // - Typically 2-5x the staleTime value
        // - Longer time = better UX when revisiting pages, but higher memory usage
        gcTime: 5 * 60 * 1000, // 5 minutes is often sufficient
        
        // retry: Based on network reliability and API stability
        // - Stable APIs: 1 retry is usually sufficient
        // - Less reliable APIs: 2-3 retries
        retry: 1,
        
        // refetchOnWindowFocus: Application sensitivity to stale data
        // - Critical data (financial/medical): true
        // - General purpose apps: false can improve UX
        refetchOnWindowFocus: false,
      },
      dehydrate: {
        serializeData: SuperJSON.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
      hydrate: {
        deserializeData: SuperJSON.deserialize,
      },
    },
  });
