import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { api } from "~/api";
import StockVisualizer from "~/features/graphs/StockVisualizer";
import TestGraph from "~/features/graphs/TestGraph";

export default function Test() {
    const stockData = useQuery({
        queryKey: [api.alphaVantage.daily.key],
        queryFn: () =>
            api.alphaVantage.daily.query({
                testing: true,
            }),
    });

    return (
        <>
            <Head>
                <title>Stock Market App</title>
                <meta
                    name="description"
                    content="Visualize Stocks"
                />
                <link
                    rel="icon"
                    href="/favicon.ico"
                />
            </Head>
            <main className="flex min-h-screen flex-col">
                <div className="mx-auto my-16 flex w-full max-w-7xl flex-col gap-4">
                    {stockData.isLoading ? (
                        <span>Loading...</span>
                    ) : (
                        <>
                            {stockData.data ? (
                                <StockVisualizer
                                    metaData={stockData.data.metaData}
                                    data={stockData.data.timeSeries}
                                />
                            ) : (
                                <span>No Data Available</span>
                            )}

                            <pre className={"w-full max-w-xs text-clip"}>
                                {JSON.stringify(
                                    stockData.data ?? stockData.error,
                                    null,
                                    4
                                )}
                            </pre>
                        </>
                    )}
                    {/* <TestGraph /> */}
                </div>
            </main>
        </>
    );
}
