import { type AppType } from "next/dist/shared/lib/utils";
import "~/styles/globals.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 mins
            refetchOnWindowFocus: false,
            retry() {
                return false;
            },
        },
    },
});

const MyApp: AppType = ({ Component, pageProps }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools />
            <Component {...pageProps} />
        </QueryClientProvider>
    );
};

export default MyApp;
