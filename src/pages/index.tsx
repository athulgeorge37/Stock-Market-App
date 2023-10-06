import {
    CalendarIcon,
    InformationCircleIcon,
} from "@heroicons/react/24/outline";
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

const TimePeriods = ["intra-day", "daily", "weekly", "monthly"] as const;
export type TimePeriodsType = (typeof TimePeriods)[number];

const TimePeriodsInformation: {
    period: TimePeriodsType;
    description: string;
}[] = [
    {
        period: "intra-day",
        description:
            "Intra-Day represents the closing price of the selected stock for the most recent trading day with each data point being recorded 5 minutes apart.",
    },
    {
        period: "daily",
        description:
            "Daily represents the closing price of the selected stock for each day within this year.",
    },
    {
        period: "weekly",
        description:
            "Weekly represents the closing price of the selected stock for the last trading day of each week since the stock's IPO.",
    },
    {
        period: "monthly",
        description:
            "Monthly represents the closing price of the selected stock for the last trading day of each month since the stock's IPO.",
    },
];

export default function Home() {
    const datePickerPopOver = usePopOver();

    const today = startOfToday();
    const [currentDaySelected, setCurrentDaySelected] = useState(today);

    const [timePeriod, setTimePeriod] = useState<TimePeriodsType>("intra-day");

    const [selectedStockSymbol, setSelectedStockSymbol] = useState<
        string | null
    >(null); // stock is the symbol

    const stockData = useQuery({
        queryKey: [api.alphaVantage.daily.key, selectedStockSymbol, timePeriod],
        queryFn: () => {
            if (timePeriod === "intra-day") {
                return api.alphaVantage.intraDay.query({
                    symbol: selectedStockSymbol!,
                });
            }

            if (timePeriod === "daily") {
                return api.alphaVantage.daily.query({
                    symbol: selectedStockSymbol!,
                });
            }

            if (timePeriod === "weekly") {
                return api.alphaVantage.weekly.query({
                    symbol: selectedStockSymbol!,
                });
            }

            if (timePeriod === "monthly") {
                return api.alphaVantage.monthly.query({
                    symbol: selectedStockSymbol!,
                });
            }
        },
        enabled: !!selectedStockSymbol,
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
                            {TimePeriods.map((tm) => (
                                <Button
                                    key={tm}
                                    onClick={() => {
                                        setTimePeriod(tm);
                                    }}
                                    variant={
                                        tm === timePeriod
                                            ? "blue"
                                            : "white-outline"
                                    }
                                    className="capitalize"
                                >
                                    {tm}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="my-4 flex items-center gap-2">
                        <InformationCircleIcon className="h-5 w-5" />
                        {TimePeriodsInformation.map((tradingPeriod) => {
                            if (tradingPeriod.period === timePeriod) {
                                return (
                                    <span
                                        key={`${tradingPeriod.period}-description`}
                                    >
                                        {tradingPeriod.description}
                                    </span>
                                );
                            }
                            return null;
                        })}
                    </div>

                    <div className="my-4 h-[500px] w-full max-w-[1200px] rounded-md border border-slate-300 shadow-lg">
                        {stockData.isFetching ? (
                            <div className="flex h-full items-center justify-center">
                                <LoadingSpinner size={"lg"} />
                            </div>
                        ) : (
                            <>
                                {stockData.data ? (
                                    <StockVisualizer
                                        data={stockData.data.timeSeries}
                                        timePeriod={timePeriod}
                                    />
                                ) : (
                                    !!selectedStockSymbol && (
                                        <span>No Data Available</span>
                                    )
                                )}
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
