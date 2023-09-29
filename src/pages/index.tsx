import { CalendarIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { format, startOfToday } from "date-fns";
import Head from "next/head";
import { useState } from "react";
import { api } from "~/api";
import Button from "~/components/Button";
import DatePicker from "~/components/DatePicker";
import LoadingSpinner from "~/components/LoadingSpinner";
import PopOver, { usePopOver } from "~/components/PopOver";
import SearchStocks from "~/features/SearchStocks";
import StockVisualizer from "~/features/graphs/StockVisualizer";

export default function Home() {
    const datePickerPopOver = usePopOver();

    const today = startOfToday();
    const [currentDaySelected, setCurrentDaySelected] = useState(today);

    const [timePeriod, setTimePeriod] = useState<
        "day" | "week" | "month" | "year"
    >("day");
    const [selectedStockSymbol, setSelectedStockSymbol] = useState<
        string | null
    >(null); // stock is the symbol

    const stockData = useQuery({
        queryKey: [api.alphaVantage.daily.key, selectedStockSymbol],
        queryFn: () =>
            api.alphaVantage.daily.query({
                symbol: selectedStockSymbol!,
            }),
        // enabled: !!selectedStockSymbol,
    });

    const stockInformation = useQuery({
        queryKey: [api.alphaVantage.getSymbolData.key, selectedStockSymbol],
        queryFn: () =>
            api.alphaVantage.getSymbolData.query({
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
                <div className="mx-auto mt-10 w-full max-w-[1200px]">
                    <h1 className="text-3xl font-bold">Stock Visualizer</h1>

                    <div className="mt-4 flex items-end justify-between">
                        <div className="flex items-end gap-2">
                            <SearchStocks
                                setSelectedStockSymbol={setSelectedStockSymbol}
                            />

                            <PopOver
                                popOver={datePickerPopOver}
                                trigger={
                                    <PopOver.Trigger
                                        variant={"white-outline"}
                                        // onClick={() => updateCurrentWeekTo("today")}
                                        IconRight={CalendarIcon}
                                    >
                                        {format(
                                            currentDaySelected,
                                            "dd - MMM - yyyy"
                                        )}
                                    </PopOver.Trigger>
                                }
                            >
                                <DatePicker
                                    currentDaySelected={currentDaySelected}
                                    setCurrentDaySelected={
                                        setCurrentDaySelected
                                    }
                                />
                            </PopOver>
                        </div>

                        <div className="flex h-fit gap-2">
                            <Button variant={"blue"}>Day</Button>
                            <Button variant={"white-outline"}>Week</Button>

                            <Button variant={"white-outline"}>Month</Button>

                            <Button variant={"white-outline"}>Year</Button>
                        </div>
                    </div>

                    <div className="my-10 h-[500px] w-full max-w-[1200px] rounded-md border border-slate-300 shadow-lg">
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

                    <div className="mb-10">
                        {stockInformation.isFetching ? (
                            <LoadingSpinner />
                        ) : stockInformation.data ? (
                            // show all stock information here
                            <div className="mt-4 flex gap-8 rounded-md border border-slate-300 p-4 shadow-md">
                                <div className="flex shrink-0 flex-col gap-2 font-medium">
                                    <span>Stock</span>
                                    <span>Symbol</span>
                                    <span>52 Week High</span>
                                    <span>52 Week Low</span>
                                    <span>Description</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span> {stockInformation.data.Name}</span>
                                    <span> {stockInformation.data.Symbol}</span>
                                    <span>
                                        ${stockInformation.data["52WeekHigh"]}
                                    </span>
                                    <span>
                                        ${stockInformation.data["52WeekLow"]}
                                    </span>
                                    <span className="line-clamp-3">
                                        {stockInformation.data.Description}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            !!selectedStockSymbol && (
                                <span className="text-rose-600">
                                    Unable to retreive {selectedStockSymbol}s
                                    information
                                </span>
                            )
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}
