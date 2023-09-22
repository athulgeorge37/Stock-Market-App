import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { useState } from "react";
import { api } from "~/api";
import Button from "~/components/Button";
import DatePicker from "~/components/DatePicker";
import Input from "~/components/Input";
import LoadingSpinner from "~/components/LoadingSpinner";
import SearchStocks from "~/features/SearchStocks";
import StockVisualizer from "~/features/graphs/StockVisualizer";

export default function Home() {
    const [selectedStockSymbol, setSelectedStockSymbol] = useState<
        string | null
    >(null); // stock is the symbol

    const stockData = useQuery({
        queryKey: [api.alphaVantage.daily.key, selectedStockSymbol],
        queryFn: () =>
            api.alphaVantage.daily.query({
                testing: true,
                symbol: selectedStockSymbol!,
            }),
        enabled: !!selectedStockSymbol,
    });

    const stockInformation = useQuery({
        queryKey: [api.alphaVantage.getSymbolData.key, selectedStockSymbol],
        queryFn: () =>
            api.alphaVantage.getSymbolData.query({
                testing: true,
                symbol: selectedStockSymbol!,
            }),
        enabled: !!selectedStockSymbol,
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
                        <SearchStocks
                            setSelectedStockSymbol={setSelectedStockSymbol}
                        />

                        {/* <div className="flex h-fit gap-2">
                            <Button variant={"blue"}>Day</Button>
                            <Button variant={"white-outline"}>Week</Button>

                            <Button variant={"white-outline"}>Month</Button>

                            <Button variant={"white-outline"}>Year</Button>
                        </div> */}
                    </div>

                    <div>
                        {stockInformation.isFetching ? (
                            <LoadingSpinner />
                        ) : stockInformation.data ? (
                            // show all stock information here
                            <div>{stockInformation.data.Name}</div>
                        ) : (
                            !!selectedStockSymbol && (
                                <span className="text-rose-600">
                                    Unable to retreive {selectedStockSymbol}s
                                    information
                                </span>
                            )
                        )}
                    </div>

                    <div className="my-10 w-full">
                        {stockData.isFetching ? (
                            <LoadingSpinner />
                        ) : (
                            <>
                                {stockData.data ? (
                                    <StockVisualizer
                                        metaData={stockData.data.metaData}
                                        data={stockData.data.timeSeries}
                                    />
                                ) : (
                                    !!selectedStockSymbol && (
                                        <span>No Data Available</span>
                                    )
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
                        {/* replace with calendar component */}
                        {/* <Input
                            id="select-investment-start-date"
                            type="date"
                            label="Select Investment Date"
                            className="w-[400px]"
                            hideError
                        /> */}
                        <DatePicker />
                    </div>
                </div>
            </main>
        </>
    );
}
