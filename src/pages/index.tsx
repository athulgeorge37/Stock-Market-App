import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { api } from "~/api";
import Button from "~/components/Button";
import Input from "~/components/Input";
import StockVisualizer from "~/features/graphs/StockVisualizer";

export default function Home() {
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
                <div className="mx-auto mt-10 w-full max-w-7xl">
                    <h1 className="text-3xl font-bold">Stock Visualizer</h1>

                    <div className="mt-4 flex items-end justify-between">
                        <Input
                            id="search-stock"
                            placeholder="TSLA"
                            label="Find A stock"
                            className="w-[400px]"
                            hideError
                        />

                        <div className="flex h-fit gap-2">
                            <Button variant={"blue"}>Day</Button>
                            <Button variant={"white-outline"}>Week</Button>

                            <Button variant={"white-outline"}>Month</Button>

                            <Button variant={"white-outline"}>Year</Button>
                        </div>
                    </div>

                    <div className="my-10 w-full">
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

                                {/* <pre
                                        className={"w-full max-w-xs text-clip"}
                                    >
                                        {JSON.stringify(
                                            stockData.data ?? stockData.error,
                                            null,
                                            4
                                        )}
                                    </pre> */}
                            </>
                        )}
                    </div>

                    <div>
                        <Input
                            id="select-investment-start-date"
                            type="date"
                            label="Select Investment Date"
                            className="w-[400px]"
                            hideError
                        />
                    </div>
                </div>
            </main>
        </>
    );
}
